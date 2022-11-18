// packages
import { ChatInputCommandInteraction, TextChannel } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration.js'
dayjs.extend(duration)

// logger
import logger from '../../winston/winston.js'

// utilities
import {
	getMonthlyAttendance,
	getMonthlyRanking,
	getTodayAttendance,
} from '../utils/attendanceUtils'
import {
	attendanceEmbed,
	attendanceRankingEmbed,
	MonthlyAttendanceDataType,
} from '../utils/embedUtils'

// get configs
import * as config from '../config/config'
const { GUILD_ADMIN_ROLE_ID, ATTENDANCE_LOG_CHANNEL_ID } = config
const ROLE_WHITELSIT = GUILD_ADMIN_ROLE_ID.split(',')
const SUBCOMMAND_WHITELIST = ['보기']

// command settings
const attendance = {
	data: new SlashCommandBuilder()
		.setName('출석')
		.setDescription('출석체크 현황, 월간 랭킹을 확인합니다.')
		.addSubcommand((subcommand) =>
			subcommand
				.setName('보기')
				.setDescription('[멤버] 특정 유저의 출석 현황을 조회합니다.')
				.addStringOption((option) =>
					option.setName('닉네임').setDescription('마인크래프트 닉네임').setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('인정')
				.setDescription('[관리자] 특정 유저의 출석을 인정합니다.')
				.addStringOption((option) =>
					option.setName('닉네임').setDescription('마인크래프트 닉네임').setRequired(true)
				)
				.addIntegerOption((option) =>
					option
						.setName('출석일자')
						.setDescription('출석을 인정할 날짜 ex. 2022-11-11')
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('철회')
				.setDescription('[관리자] 특정 유저의 출석을 인정을 철회합니다.')
				.addStringOption((option) =>
					option.setName('닉네임').setDescription('마인크래프트 닉네임').setRequired(true)
				)
				.addIntegerOption((option) =>
					option
						.setName('출석일자')
						.setDescription('출석을 인정할 날짜 ex. 2022-11-11')
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('랭킹')
				.setDescription('[관리자] 월간 출석 랭킹을 조회합니다.')
				.addStringOption((option) =>
					option.setName('조회기간').setDescription('조회할 연월 ex. 2022-11').setRequired(true)
				)
				.addIntegerOption((option) =>
					option.setName('랭킹범위').setDescription('조회할 랭킹 범위 TopN').setRequired(true)
				)
		),
	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply({ ephemeral: true })

		// client info
		const {
			client,
			user: { id, username, discriminator },
			options,
		} = interaction
		const userTag = `${username}#${discriminator}`
		const guildOwner = interaction.guild?.ownerId

		// get options
		const subCommand = options.getSubcommand()
		const playerName = options.getString('닉네임') as string
		const dateKey = options.getString('출석일자') as string
		const rankYearMonth = options.getString('조회기간') as string
		const rankCount = options.getInteger('랭킹범위') as number

		// log
		logger.info(`[Discord.js] ${userTag}(이)가 /출석 ${subCommand} 명령어를 사용했습니다.`)

		// bot owner & admin permission check
		const adminOwnerCheck = ROLE_WHITELSIT.includes(id)

		// guild owner permission check
		const guileOwnerCheck = id === guildOwner

		// subcommand permission check
		const subCommandCheck = SUBCOMMAND_WHITELIST.includes(subCommand)

		// command permission check
		if (!adminOwnerCheck && !guileOwnerCheck && !subCommandCheck) {
			logger.error(`[Discord.js] 😢 명령어를 실행할 권한이 없어요!`)
			await interaction.editReply(`😢 명령어를 실행할 권한이 없어요!`)
			return
		}

		// execute command
		if (subCommand === '보기') {
			// get today's attendance
			const todayAttendance = await getTodayAttendance(playerName)

			// get monthly attendance
			const yearMonth = dayjs(new Date()).format('YYYY-MM')
			const monthlyAttendance = await getMonthlyAttendance(yearMonth, playerName)

			// check data
			if (!todayAttendance || !monthlyAttendance) {
				logger.error(`[Discord.js] 😣 조회할 수 있는 데이터가 없어요!`)
				await interaction.editReply(`😣 조회할 수 있는 데이터가 없어요!`)
				return
			}

			// format playtime
			const playTime = dayjs.duration(todayAttendance.playTime, 'seconds')
			const playTimeHour = Math.floor(playTime.asHours()) || '0'
			const playTimeKR = `${playTimeHour}시간 ${playTime.minutes()}분 ${playTime.seconds()}초`

			// create embed
			const logEmbed = attendanceEmbed({
				dateKey: todayAttendance.dateKey,
				lastLogout: todayAttendance.lastLogout,
				username: todayAttendance.username,
				playTimeKR,
				approved: todayAttendance.approved,
				monthly: monthlyAttendance.length,
			})

			// reply to user
			await interaction.editReply({
				embeds: [logEmbed],
			})
		} else if (subCommand === '인정') {
		} else if (subCommand === '철회') {
		} else if (subCommand === '랭킹') {
			// get monthly attendance ranking
			const rankingData = await getMonthlyRanking(rankYearMonth, rankCount)

			// check ranking data
			if (!rankingData || rankingData.length === 0) {
				logger.error(`[Discord.js] 😣 조회할 수 있는 데이터가 없어요!`)
				await interaction.editReply(`😣 조회할 수 있는 데이터가 없어요!`)
				return
			}

			// process ranking data
			const embedData = rankingData.map((item: MonthlyAttendanceDataType) => {
				// format playtime
				const playTime = dayjs.duration(item.totalPlaytime, 'seconds')
				const playTimeHour = Math.floor(playTime.asHours()) || '0'
				const playTimeKR = `${playTimeHour}시간 ${playTime.minutes()}분 ${playTime.seconds()}초`
				return {
					...item,
					username: item._id,
					playTimeKR,
				}
			})

			// reply to command
			const pageLimit = 8
			if (embedData.length > pageLimit) {
				// handle embed field length limit
				const tmpArr = embedData.slice()
				let pageLength = Math.ceil(embedData.length / 8)

				// split data
				for (let i = 0; i < pageLength; i++) {
					const start = pageLimit * i
					const data = tmpArr.slice(start, pageLimit * (i + 1))

					// create embed
					const logEmbed = attendanceRankingEmbed(rankYearMonth, rankCount, data, start)

					// send embed message to log channel
					const channel = client.channels.cache.get(ATTENDANCE_LOG_CHANNEL_ID) as TextChannel
					channel.send({ embeds: [logEmbed] })
				}
			} else {
				// create embed
				const logEmbed = attendanceRankingEmbed(rankYearMonth, rankCount, embedData)

				// send embed message to log channel
				const channel = client.channels.cache.get(ATTENDANCE_LOG_CHANNEL_ID) as TextChannel
				channel.send({ embeds: [logEmbed] })
			}

			// log
			logger.info(`[Discord.js] 🎊 ${rankYearMonth} 기간의 TOP${rankCount} 랭킹이 출력됬어요!`)

			// reply to user
			await interaction.editReply(`🎊 ${rankYearMonth} 기간의 TOP${rankCount} 랭킹이 출력됬어요!`)
		} else {
			const message = `[Discord.js] 🤔 알 수 없는 명령어 옵션이에요.`
			logger.error(message)
			await interaction.editReply(message)
			return
		}
	},
}

export default attendance
