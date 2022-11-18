// packages
import dayjs from 'dayjs'

// get configs
import * as config from '../config/config'
const { ATTENDANCE_MIN_TIME } = config

// data model
import Attendance from '../models/attendance'

/**
 * check today's attendance log of specific user
 */
const checkTodayUserLog = async (username: string) => {
	const now = dayjs(new Date())
	const dateKey = now.format('YYYY-MM-DD')

	// get today's attendance log
	const attendance = await Attendance.getTodayAttendance(username, dateKey)

	// create attendance log if not exists
	if (!attendance) {
		// set payload
		const payload = {
			dateKey,
			username,
			firstLogin: now.format('YYYY-MM-DD HH:mm:ss'),
			lastLogin: now.format('YYYY-MM-DD HH:mm:ss'),
			playTime: 0,
		}

		// create document
		await Attendance.logAttendance(payload)
	}
}

/**
 * get today's attendance log of specific user
 */
const getTodayAttendance = async (username: string) => {
	const now = dayjs(new Date())
	const dateKey = now.format('YYYY-MM-DD')

	// get today's attendance log
	return await Attendance.getTodayAttendance(username, dateKey)
}

/**
 * update last login time of specific user
 */
const updateLastLogin = async (username: string) => {
	const now = dayjs(new Date())
	const dateKey = now.format('YYYY-MM-DD')

	// update document
	return await Attendance.updateAttendance(username, dateKey, {
		lastLogin: now.format('YYYY-MM-DD HH:mm:ss'),
	})
}

/**
 * update logout time of specific user
 */
const updateLastLogout = async (username: string) => {
	const now = dayjs(new Date())
	const dateKey = now.format('YYYY-MM-DD')

	// get today's attendance log
	const attendance = await Attendance.getTodayAttendance(username, dateKey)

	// check playtime
	const playTime = now.unix() - dayjs(attendance.lastLogin, 'YYYY-MM-DD HH:mm:ss').unix()
	const totalPlayTime = attendance.playTime + playTime
	const approved = totalPlayTime >= ATTENDANCE_MIN_TIME

	// update document
	return await Attendance.updateAttendance(username, dateKey, {
		lastLogout: now.format('YYYY-MM-DD HH:mm:ss'),
		playTime: totalPlayTime,
		approved,
	})
}

/**
 * get monthly attendance stats
 */
const getMonthlyAttendance = async (yearMonth: string, username: string) => {
	const base = dayjs(`${yearMonth}-01 00:00:00`, 'YYYY-MM-DD HH:mm:ss')

	const start = `${base.format('YYYY-MM')}-01T00:00:00.000+09:00`
	const end = `${base.add(1, 'months').format('YYYY-MM')}-01T00:00:00.000+09:00`

	// get monthly attendance
	return await Attendance.getMonthlyAttendance(username, start, end)
}

/**
 * get monthly attendance ranking
 */
const getMonthlyRanking = async (yearMonth: string, count: number) => {
	// get monthly rank
	return await Attendance.getMonthlyRank(yearMonth, count)
}

export {
	checkTodayUserLog,
	getTodayAttendance,
	updateLastLogin,
	updateLastLogout,
	getMonthlyAttendance,
	getMonthlyRanking,
}
