// packages
import * as mcutil from 'minecraft-server-util'

// get config
import * as config from '../config/config'
const { MINECRAFT_HOST, MINECRAFT_QUERY_PORT } = config

// parse config

/**
 * Get minecraft server status
 */
const getServerStatus = async () => {
	// get server status
	const status = await mcutil.status(MINECRAFT_HOST, parseInt(MINECRAFT_QUERY_PORT), {
		enableSRV: true,
		timeout: 1000 * 5,
	})

	return status
}

export default getServerStatus
