// packages
import { Events, Message } from 'discord.js'

// handlers
import handleAttendanceMessage from '../handlers/attendanceLogHandler'
import handleItemUsageMessage from '../handlers/itemUsageLogHandler'
import handleStockMessage from './../handlers/stockLogHandler'

// get configs
import * as config from '../config/config'
const { SERVER_LOG_CHANNEL_ID, SERVER_CONSOLE_CHANNEL_ID, STOCK_LOG_CHANNEL_ID } = config

// set event
const messageCreateEvent = {
	name: Events.MessageCreate,
	async execute(message: Message) {
		// server log channel
		if (message.channelId === SERVER_LOG_CHANNEL_ID) {
			await handleAttendanceMessage(message)
		}
		// server console channel
		if (message.channelId === SERVER_CONSOLE_CHANNEL_ID) {
			await handleItemUsageMessage(message)
			await handleStockMessage(message)
		}
	},
}

export default messageCreateEvent
