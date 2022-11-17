// packages
import { Events, BaseInteraction } from 'discord.js'

// logger
import logger from '../../winston/winston.js'

// set event
const interectionCreateEvent = {
	name: Events.InteractionCreate,
	async execute(interaction: BaseInteraction) {
		// is command
		if (!interaction.isCommand()) return

		// get client
		const { client } = interaction

		// get command
		const command = client.commands.get(interaction.commandName)

		// check command
		if (!command) return

		try {
			await command.execute(interaction)
		} catch (error) {
			logger.error(`[Discord.js] ${error}`)

			await interaction.reply({
				content: 'There was an error while executing this command!',
				ephemeral: true,
			})
		}
	},
}

export default interectionCreateEvent
