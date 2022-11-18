// packages
import { CommandInteraction, GuildMemberRoleManager } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'

// logger
import logger from '../../winston/winston.js'

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
	async execute(interaction: CommandInteraction) {
		await interaction.deferReply({ ephemeral: true })

		// client instance
		const { client } = interaction

		// client info
		const {
			user: { id, username, discriminator },
		} = interaction
		const userTag = `${username}#${discriminator}`
		const roles = [...(interaction.member?.roles as GuildMemberRoleManager).cache.keys()]
		const guildOwner = interaction.guild?.ownerId

		console.log(guildOwner)

		await interaction.editReply('hello')
	},
}

export default attendance
