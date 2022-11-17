// packages
import * as fs from 'fs'
import * as path from 'path'
import { Client, GatewayIntentBits, Collection } from 'discord.js'

// get configs
import * as config from './config/config'
const { DISCORD_TOKEN } = config

// database
import connectDB from './db/mongodb'
connectDB()
;(async function () {
	// create discord bot client instance
	const client = new Client({
		intents: [
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildMembers,
			GatewayIntentBits.GuildMessages,
		],
	})

	// get commands
	client.commands = new Collection()

	// read command dir
	const commandFiles = fs
		.readdirSync(path.join(__dirname, './commands'))
		.filter((file) => file.endsWith('.js'))

	// set commands
	for (const file of commandFiles) {
		const { default: command } = await import(`./commands/${file}`)
		// Set a new item in the Collection
		// With the key as the command name and the value as the exported module
		client.commands.set(command.data.name, command)
	}

	// read event dir
	const eventFiles = fs
		.readdirSync(path.join(__dirname, './events'))
		.filter((file) => file.endsWith('.js'))

	// set events
	for await (const file of eventFiles) {
		const { default: event } = await import(`./events/${file}`)

		// check once
		if (event.once) {
			client.once(event.name, (...args) => event.execute(...args))
		} else {
			client.on(event.name, (...args) => event.execute(...args))
		}
	}

	// bot login
	client.login(DISCORD_TOKEN)
})()
