// packages
import { Events, Message } from 'discord.js'

// handlers
import handleAttendanceMessage from '../handlers/attendanceLogHandler'

// get configs
import * as config from '../config/config'
const { SERVER_LOG_CHANNEL_ID } = config

// set event
const messageCreateEvent = {
	name: Events.MessageCreate,
	async execute(message: Message) {
		// server log channel
		if (message.channelId === SERVER_LOG_CHANNEL_ID) {
			await handleAttendanceMessage(message)
		}
	},
}

export default messageCreateEvent
