// packages
import { Message, TextChannel } from 'discord.js'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration.js'
dayjs.extend(duration)

// logger
import logger from '../../winston/winston.js'

// utilities
import {
	checkTodayUserLog,
	getMonthlyAttendance,
	updateLastLogin,
	updateLastLogout,
} from '../utils/attendanceUtils'
import { attendanceEmbed } from '../utils/embedUtils'

// get configs
import * as config from '../config/config'
const { ATTENDANCE_LOG_CHANNEL_ID } = config

// handler
const handleAttendanceMessage = async (message: Message) => {
	const {
		client,
		content,
		author: { bot, username },
	} = message

	// set login & logout message
	const LOG_MESSAGES = {
		login: '님이 서버에 접속했어요!',
		logout: '님이 서버에서 로그아웃 했어요.',
	}

	// bot(webhook) check
	if (!bot) return

	// only accept login & logout messages
	const isLogin = content.includes(LOG_MESSAGES.login)
	const isLogout = content.includes(LOG_MESSAGES.logout)
	if (!isLogin && !isLogout) return

	// check today's attendance
	await checkTodayUserLog(username)

	// login
	if (isLogin) {
		// update today's attendance log
		await updateLastLogin(username)
		logger.info(`[Attendance] ${username}님이 로그인 했습니다.`)
	}

	// logout
	if (isLogout) {
		// update today's attendance log
		const res = await updateLastLogout(username)

		// format playtime
		const playTime = dayjs.duration(res.playTime, 'seconds')
		const playTimeKR = `${playTime.hours()}시간 ${playTime.minutes()}분 ${playTime.seconds()}초`

		// get monthly attendance
		const yearMonth = dayjs(new Date()).format('YYYY-MM')
		const monthlyAttendance = await getMonthlyAttendance(yearMonth, username)

		// create embed
		const logEmbed = attendanceEmbed({
			dateKey: res.dateKey as string,
			lastLogout: res.lastLogout as string,
			username,
			playTimeKR,
			approved: res.approved as boolean,
			monthly: monthlyAttendance.length,
		})

		// send embed message to log channel
		const channel = client.channels.cache.get(ATTENDANCE_LOG_CHANNEL_ID) as TextChannel
		channel.send({ embeds: [logEmbed] })

		// log
		if (res.approved) {
			logger.info(`[Attendance] ${username}님이 오늘 접속조건을 달성했습니다.`)
		}
		logger.info(`[Attendance] ${username}님이 로그아웃 했습니다. - ${playTimeKR}`)
	}
}

export default handleAttendanceMessage
