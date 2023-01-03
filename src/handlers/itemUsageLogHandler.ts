// packages
import { Message, TextChannel } from 'discord.js'

// logger
import logger from '../../winston/winston.js'

// utilities
import {
	type EnchantScrollRecipeDataType,
	type RandomBoxDataType,
	type EnchantScrollDataType,
	enchantScrollEmbed,
	enchantScrollRecipeEmbed,
	randomBoxEmbed,
} from '../utils/embedUtils'

// get configs
import * as config from '../config/config'
const { ITEM_USAGE_LOG_CHANNEL_ID } = config

// handler
const handleItemUsageMessage = async (message: Message) => {
	const {
		client,
		content,
		author: { bot, username },
	} = message

	// bot(webhook) check
	if (!bot) return

	// log prefix
	const LOG_PREFIX = {
		enchantScroll: '[강화로그]',
		enchantScrollRecipe: '[레시피로그]',
		randomBox: '[랜덤박스로그]',
	}

	// check log type
	const isEnchantScroll = content.includes(LOG_PREFIX.enchantScroll)
	const isEnchantScrollRecipe = content.includes(LOG_PREFIX.enchantScrollRecipe)
	const isRandomBox = content.includes(LOG_PREFIX.randomBox)
	if (!isEnchantScroll && !isEnchantScrollRecipe && !isRandomBox) return

	// enchant scroll log
	if (isEnchantScroll) {
		// parse data
		const [playerName, itemName, enchant, enchantName, level, result] = content
			.split(LOG_PREFIX.enchantScroll)[0]
			.replace(LOG_PREFIX.enchantScroll, '')
			.split('|')
		const data = {
			playerName,
			itemName,
			enchant,
			enchantName,
			level,
			result,
		} satisfies EnchantScrollDataType

		// log
		logger.info(
			`[EnchantScroll] ${playerName}님이 ${itemName}의 ${enchantName}+${level} 강화에 ${
				result === 'success' ? '성공' : '실패'
			}했습니다.`
		)

		// create embed
		const logEmbed = enchantScrollEmbed(data)

		// send embed message to log channel
		const channel = client.channels.cache.get(ITEM_USAGE_LOG_CHANNEL_ID) as TextChannel
		channel.send({ embeds: [logEmbed] })
	}

	// enchant scroll recipe log
	if (isEnchantScrollRecipe) {
		// parse data
		const [playerName, scrollRecipeType, scrollRecipeName, scroll, scrollName] = content
			.split(LOG_PREFIX.enchantScrollRecipe)[0]
			.replace(LOG_PREFIX.enchantScrollRecipe, '')
			.split('|')

		const data = {
			playerName,
			scrollRecipeType,
			scrollRecipeName,
			scroll,
			scrollName,
		} satisfies EnchantScrollRecipeDataType

		// log
		logger.info(
			`[EnchantScrollRecipe] ${playerName}님이 ${scrollRecipeName}에서 ${scrollName}를 획득했습니다.`
		)

		// create embed
		const logEmbed = enchantScrollRecipeEmbed(data)

		// send embed message to log channel
		const channel = client.channels.cache.get(ITEM_USAGE_LOG_CHANNEL_ID) as TextChannel
		channel.send({ embeds: [logEmbed] })
	}

	// random box prize log
	if (isRandomBox) {
		// parse data
		const [playerName, randomBox, randomBoxName, prize, prizeName, quantity] = content
			.split(LOG_PREFIX.randomBox)[0]
			.replace(LOG_PREFIX.randomBox, '')
			.split('|')

		const data = {
			playerName,
			randomBox,
			randomBoxName,
			prize,
			prizeName,
			quantity,
		} satisfies RandomBoxDataType

		// log
		logger.info(
			`[RandomBox] ${playerName}님이 ${randomBoxName}에서 ${prizeName}x${quantity}개를 획득했습니다.`
		)

		// create embed
		const logEmbed = randomBoxEmbed(data)

		// send embed message to log channel
		const channel = client.channels.cache.get(ITEM_USAGE_LOG_CHANNEL_ID) as TextChannel
		channel.send({ embeds: [logEmbed] })
	}
}

export default handleItemUsageMessage
