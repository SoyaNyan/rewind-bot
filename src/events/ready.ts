// packages
import { Events, Client } from 'discord.js'

// utilities
import updatePresence from '../utils/updatePresence'

// logger
import logger from '../../winston/winston.js'

// get configs
import * as config from '../config/config'
const { PRESENCE_UPDATE_INTERVAL } = config

// set event
const readyEvent = {
	name: Events.ClientReady,
	once: true,
	execute(client: Client) {
		// set presence
		updatePresence(client)

		// update presence
		setInterval(() => {
			updatePresence(client)
		}, parseInt(PRESENCE_UPDATE_INTERVAL))
		logger.info('[Discord.js] 디스코드 봇이 실행중입니다!')
	},
}

export default readyEvent
