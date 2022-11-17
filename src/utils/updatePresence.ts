// packages
import { Client, ActivityType } from 'discord.js'

// utilities
import getServerStatus from './minecraftUtil'

// update bot presence
const updatePresence = async (client: Client) => {
	// get server status
	const serverStatus = await getServerStatus()

	// check status
	if (serverStatus) {
		// get online player data
		const {
			players: { online, max },
		} = serverStatus

		// set presence
		client.user?.setPresence({
			activities: [
				{
					name: `Rewind Realm ${online}/${max}`,
					type: ActivityType.Playing,
				},
			],
			status: 'online',
		})
	} else {
		// set presence
		client.user?.setPresence({
			activities: [
				{
					name: `Rewind Realm 오프라인`,
					type: ActivityType.Playing,
				},
			],
			status: 'dnd',
		})
	}
}

export default updatePresence
