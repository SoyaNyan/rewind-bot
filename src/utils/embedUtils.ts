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
export type MonthlyAttendanceDataType = {
	_id: string
	username: string
	totalAttd: number
	totalPlaytime: number
	playTimeKR?: string
}
export type EnchantScrollDataType = {
	playerName: string
	itemName: string
	enchant: string
	enchantName: string
	level: string
	result: string
}
export type EnchantScrollRecipeDataType = {
	playerName: string
	scrollRecipeType: string
	scrollRecipeName: string
	scroll: string
	scrollName: string
}
export type RandomBoxDataType = {
	playerName: string
	randomBox: string
	randomBoxName: string
	prize: string
	prizeName: string
	quantity: string
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
		.setThumbnail(`https://mc-heads.net/avatar/${username}`)
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
			text: `Rewind Again - ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`,
			iconURL: FOOTER_IMAGE,
		})
}

/**
 * weekly attendance embed
 */
export const weeklyAttendanceEmbed = (
	weekStart: string,
	weekEnd: string,
	data: Array<MonthlyAttendanceDataType>,
	start = 0
) => {
	// create embed
	const embed = new EmbedBuilder()
		.setColor('#A2E1DB')
		.setTitle(`📅  ${weekStart} ~ ${weekEnd} 주간 출석 달성현황`)
		.setDescription('이번 주 7회 출석을 달성했어요! 🎉')
		.setThumbnail(AUTHOR_IMAGE)
		.setFooter({
			text: `Rewind Again - ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`,
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
		.setDescription('이달의 출석왕은 TOP5 까지!! 🎉')
		.setThumbnail(AUTHOR_IMAGE)
		.setFooter({
			text: `Rewind Again - ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`,
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

/**
 * enchant scroll log embed
 */
export const enchantScrollEmbed = (payload: EnchantScrollDataType) => {
	const { playerName, itemName, enchant, enchantName, level, result } = payload

	// create embed
	const embed = new EmbedBuilder()
		.setColor('#FFC8A2')
		.setTitle(`🪧  강화 주문서 사용 로그`)
		.setDescription(`${playerName}님이 아이템을 사용했어요!`)
		.setThumbnail(`https://mc-heads.net/avatar/${playerName}`)
		.setFooter({
			text: `Rewind Again - ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`,
			iconURL: FOOTER_IMAGE,
		})
		.addFields(
			{
				name: '닉네임',
				value: `\`${playerName}\``,
				inline: true,
			},
			{
				name: '강화 아이템',
				value: `\`${itemName}\``,
				inline: true,
			},
			{
				name: '\u200B',
				value: '\u200B',
				inline: true,
			}
		)
		.addFields(
			{
				name: '인챈트 이름',
				value: `\`${enchantName}\``,
				inline: true,
			},
			{
				name: '인챈트 레벨',
				value: `\`+${level}\``,
				inline: true,
			},
			{
				name: '인챈트 결과',
				value: `\`${result === 'success' ? '성공' : '실패'}\``,
				inline: true,
			}
		)

	return embed
}

/**
 * enchant scroll recipe log embed
 */
export const enchantScrollRecipeEmbed = (payload: EnchantScrollRecipeDataType) => {
	const { playerName, scrollRecipeType, scrollRecipeName, scroll, scrollName } = payload

	const embed = new EmbedBuilder()
		.setColor('#F6EAC2')
		.setTitle(`📜  강화 주문서 레시피 사용 로그`)
		.setDescription(`${playerName}님이 아이템을 사용했어요!`)
		.setThumbnail(`https://mc-heads.net/avatar/${playerName}`)
		.setFooter({
			text: `Rewind Again - ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`,
			iconURL: FOOTER_IMAGE,
		})
		.addFields(
			{
				name: '닉네임',
				value: `\`${playerName}\``,
				inline: false,
			},
			{
				name: '레시피 이름',
				value: `\`${scrollRecipeName}\``,
				inline: false,
			},
			{
				name: '획득 주문서',
				value: `\`${scrollName}\``,
				inline: false,
			}
		)

	return embed
}

/**
 * random box prize log embed
 */
export const randomBoxEmbed = (payload: RandomBoxDataType) => {
	const { playerName, randomBox, randomBoxName, prize, prizeName, quantity } = payload

	const embed = new EmbedBuilder()
		.setColor('#ECEAE4')
		.setTitle(`💎  랜덤박스 사용 로그`)
		.setDescription(`${playerName}님이 아이템을 사용했어요!`)
		.setThumbnail(`https://mc-heads.net/avatar/${playerName}`)
		.setFooter({
			text: `Rewind Again - ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`,
			iconURL: FOOTER_IMAGE,
		})
		.addFields(
			{
				name: '닉네임',
				value: `\`${playerName}\``,
				inline: true,
			},
			{
				name: '랜덤박스 이름',
				value: `\`${randomBoxName}\``,
				inline: true,
			},
			{
				name: '\u200B',
				value: '\u200B',
				inline: true,
			}
		)
		.addFields(
			{
				name: '상품 아이템',
				value: `\`${prizeName}\``,
				inline: true,
			},
			{
				name: '상품 수량',
				value: `\`${quantity} 개\``,
				inline: true,
			},
			{
				name: '\u200B',
				value: '\u200B',
				inline: true,
			}
		)

	return embed
}
