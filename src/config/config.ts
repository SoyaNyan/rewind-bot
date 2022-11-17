// packages
import * as dotenv from 'dotenv'
import * as path from 'path'

// get config
dotenv.config({ path: path.join(__dirname, './.env') })
const {
	NODE_ENV = '',
	MONGO_URI = '',
	DISCORD_CLIENT_ID = '',
	DISCORD_TOKEN = '',
	PRESENCE_UPDATE_INTERVAL = '',
	GUILD_ID = '',
	GUILD_ADMIN_ROLE_ID = '',
	SERVER_LOG_CHANNEL_ID = '',
	ATTENDANCE_LOG_CHANNEL_ID = '',
	ATTENDANCE_MIN_TIME = '',
	MINECRAFT_HOST = '',
	MINECRAFT_QUERY_PORT = '',
} = process.env

export {
	NODE_ENV,
	MONGO_URI,
	DISCORD_CLIENT_ID,
	DISCORD_TOKEN,
	PRESENCE_UPDATE_INTERVAL,
	GUILD_ID,
	GUILD_ADMIN_ROLE_ID,
	SERVER_LOG_CHANNEL_ID,
	ATTENDANCE_LOG_CHANNEL_ID,
	ATTENDANCE_MIN_TIME,
	MINECRAFT_HOST,
	MINECRAFT_QUERY_PORT,
}