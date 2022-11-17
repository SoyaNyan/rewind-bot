// packages
import { Schema, model, Model } from 'mongoose'

// types
type AttendanceType = {
	dateKey: string
	username: string
	firstLogin: string
	lastLogin: string
	lastLogout: string
	playTime: number
	approved: boolean
}
type AttendanceModelType = Model<AttendanceType>

// define scheme
const attendanceScheme = new Schema<AttendanceType>(
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
attendanceScheme.static('create', function (payload) {
	// save data
	const attendance = new this(payload)
	return attendance.save()
})

/**
 * Update user's attendance data as approved on specific date
 */
attendanceScheme.static('approveAttendance', function (username, dateKey) {
	return this.findOneAndUpdate(
		{
			username,
			dateKey,
		},
		{
			approved: true,
		},
		{ new: true }
	)
})

/**
 * Get monthly attendance of user
 */
attendanceScheme.static('getMonthlyAttendance', function (username, start, end) {
	return this.find({
		username,
		createdAt: { $gte: new Date(start), $lt: new Date(end) },
		approved: true,
	})
})

/**
 * Find top N user of specific month range
 */
attendanceScheme.static('getMonthlyRank', function (yearMonth, count) {
	return this.aggregate([
		{
			$match: {
				dateKey: {
					$regex: yearMonth,
					$options: 'i',
				},
				approved: true,
				username: {
					$ne: 'SOYANYAN',
				},
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
const Attendance = model<AttendanceType, AttendanceModelType>('Attendance', attendanceScheme)

export default Attendance
