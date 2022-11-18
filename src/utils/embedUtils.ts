// packages
import { EmbedBuilder } from 'discord.js'
import dayjs from 'dayjs'

// get configs
import * as config from '../config/config'
const { AUTHOR_IMAGE, FOOTER_IMAGE } = config

// types
type AttendancePayloadType = {
	dateKey: string
	lastLogout: string
	username: string
	playTimeKR: string
	approved: boolean
	monthly: number
}
type MonthlyAttendanceDataType = {
	username: string
	playTimeKR: string
	totalAttd: number
}

/**
 * attendance log embed
 */
export const attendanceEmbed = (payload: AttendancePayloadType) => {
	const { dateKey, lastLogout, username, playTimeKR, approved, monthly } = payload

	// set embed description
	const desc = approved ? `오늘 출석을 완료했어요! 😊` : `아직 출석 조건을 달성하지 않았어요... 😅`

	// create embed
	return new EmbedBuilder()
		.setColor('#FF968A')
		.setTitle(`📅  ${username}님의 출석현황`)
		.setDescription(desc)
		.addFields(
			{
				name: '출석일자',
				value: `${dateKey}`,
				inline: true,
			},
			{
				name: '마지막 로그아웃',
				value: `${lastLogout}`,
				inline: true,
			},
			{
				name: '\u200b',
				value: '\u200b',
				inline: true,
			}
		)
		.addFields(
			{
				name: '오늘 접속시간',
				value: `${playTimeKR}`,
				inline: true,
			},
			{
				name: '오늘 출석달성',
				value: `${approved ? '``달성``' : '``미달성``'}`,
				inline: true,
			}
		)
		.addFields({
			name: '이번달 출석일 수',
			value: `${monthly}일`,
		})
		.setFooter({
			text: `Rewind Again - ${dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')}`,
			iconURL: FOOTER_IMAGE,
		})
}

/**
 * attendance ranking embed
 */
export const attendanceRankingEmbed = (
	yearMonth: string,
	count: number,
	data: Array<MonthlyAttendanceDataType>,
	start = 0
) => {
	// create embed
	const embed = new EmbedBuilder()
		.setColor('#FFC8A2')
		.setTitle(`📅  ${yearMonth}의 출석랭킹 TOP${count}`)
		.setDescription('이달의 출근왕은 TOP3 까지!! 🎉')
		.setThumbnail(AUTHOR_IMAGE)
		.setFooter({
			text: `Rewind Again - ${dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')}`,
			iconURL: FOOTER_IMAGE,
		})

	// add fields
	data.forEach((item, index) => {
		embed.addFields(
			{
				name: `TOP ${index + 1 + start}`,
				value: `${item.username}`,
				inline: true,
			},
			{
				name: `누적 접속시간`,
				value: `${item.playTimeKR}`,
				inline: true,
			},
			{
				name: `출석횟수`,
				value: `${item.totalAttd}회`,
				inline: true,
			}
		)
	})

	return embed
}
