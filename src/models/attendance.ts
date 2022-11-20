// packages
import { Schema, model, Model } from 'mongoose'

// get configs
import * as config from '../config/config'
const { ATTENDANCE_WEEKLY_MIN_COUNT } = config

// types
interface Attendance {
	dateKey: string
	username: string
	firstLogin: string
	lastLogin: string
	lastLogout: string
	playTime: number
	approved: boolean
}
interface AttendancePayload {
	dateKey?: string
	username?: string
	firstLogin?: string
	lastLogin?: string
	lastLogout?: string
	playTime?: number
	approved?: boolean
}
interface AttendanceModel extends Model<Attendance> {
	logAttendance: (payload: AttendancePayload) => Promise<void>
	updateAttendance: (username: string, dateKey: string, payload: AttendancePayload) => Promise<any>
	getTodayAttendance: (username: string, dateKey: string) => Promise<any>
	getMonthlyAttendance: (username: string, start: string, end: string) => Promise<any>
	getWeeklyStats: (start: string, end: string) => Promise<any>
	getMonthlyRank: (yearMonth: string, count: number) => Promise<any>
}

// define scheme
const attendanceScheme = new Schema<Attendance, AttendanceModel>(
	{
		dateKey: {
			type: String,
			requried: true,
		},
		username: {
			type: String,
			requried: true,
		},
		firstLogin: {
			type: String,
			requried: true,
		},
		lastLogin: {
			type: String,
			requried: true,
		},
		lastLogout: {
			type: String,
		},
		playTime: {
			type: Number,
			requried: true,
			default: 0,
		},
		approved: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
)

// statics
/**
 * Save single attendance data
 */
attendanceScheme.static('logAttendance', function logAttendance(payload) {
	// save data
	const attendance = new this(payload)
	return attendance.save()
})

/**
 * Update single attendance data
 */
attendanceScheme.static('updateAttendance', function updateAttendance(username, dateKey, payload) {
	return this.findOneAndUpdate({ username, dateKey }, payload, { new: true })
})

/**
 * Get today's attendance log of specific user
 */
attendanceScheme.static('getTodayAttendance', function getTodayAttendance(username, dateKey) {
	return this.findOne({ username, dateKey })
})

/**
 * Get monthly attendance of user
 */
attendanceScheme.static(
	'getMonthlyAttendance',
	function getMonthlyAttendance(username, start, end) {
		return this.find({
			username,
			createdAt: {
				$gte: new Date(start),
				$lt: new Date(end),
			},
			approved: true,
		})
	}
)

/**
 * Check weekly attendance stats
 */
attendanceScheme.static('getWeeklyStats', function getWeeklyStats(start, end) {
	return this.aggregate([
		{
			$match: {
				createdAt: {
					$gte: new Date(start),
					$lt: new Date(end),
				},
				approved: true,
			},
		},
		{
			$group: {
				_id: '$username',
				totalAttd: {
					$sum: 1,
				},
				totalPlayTime: {
					$sum: '$playTime',
				},
			},
		},
		{
			$match: {
				totalAttd: {
					$gte: parseInt(ATTENDANCE_WEEKLY_MIN_COUNT),
				},
			},
		},
		{
			$sort: {
				totalAttd: -1,
				totalPlaytime: -1,
			},
		},
	])
})

/**
 * Find top N user of specific month range
 */
attendanceScheme.static('getMonthlyRank', function getMonthlyRank(yearMonth, count) {
	return this.aggregate([
		{
			$match: {
				dateKey: {
					$regex: yearMonth,
					$options: 'i',
				},
				approved: true,
				// username: {
				// 	$ne: 'SOYANYAN',
				// },
			},
		},
		{
			$group: {
				_id: '$username',
				totalAttd: {
					$sum: 1,
				},
				totalPlaytime: {
					$sum: '$playTime',
				},
			},
		},
		{
			$sort: {
				totalAttd: -1,
				totalPlaytime: -1,
			},
		},
		{
			$limit: count,
		},
	])
})

// create model
const Attendance = model<Attendance, AttendanceModel>('attendance', attendanceScheme)

export default Attendance
