// packages
import * as fs from 'fs'
import * as path from 'path'
import { REST } from '@discordjs/rest'
import { Routes, RESTPostAPIApplicationCommandsJSONBody } from 'discord.js'

// logger
import logger from '../winston/winston.js'

// get configs
import * as config from './config/config'
const { DISCORD_CLIENT_ID, DISCORD_TOKEN, GUILD_ID } = config

// types
type RESTAPIRoutesType = `/${string}`

// main
;(async () => {
	// get commands
	const commands: Array<RESTPostAPIApplicationCommandsJSONBody> = []
	const commandFiles = fs
		.readdirSync(path.join(__dirname, './commands'))
		.filter((file) => file.endsWith('.js'))

	for await (const file of commandFiles) {
		const { default: command } = await import(`./commands/${file}`)
		commands.push(command.data.toJSON())
	}

	// rest client
	const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN)

	// register commands
	rest
		.put(
			Routes.applicationGuildCommands(DISCORD_CLIENT_ID, GUILD_ID) as unknown as RESTAPIRoutesType,
			{
				body: commands,
			}
		)
		.then(() => {
			logger.info('[Discord.js] Successfully registered application commands.')
		})
		.catch((error) => {
			logger.error('[Discord.js] Failed to register application commands.')
			logger.error(`[Discord.js] ${error}`)
		})
})()
