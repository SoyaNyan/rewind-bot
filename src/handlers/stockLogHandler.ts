// packages
import { Message, TextChannel } from 'discord.js'

// logger
import logger from '../../winston/winston.js'

// get configs
import * as config from '../config/config'
const { STOCK_LOG_CHANNEL_ID } = config

// utilities
import { stockEmbed, type StockDataType } from '../utils/embedUtils.js'

// format currency with commas
const formatWithCommas = (value: string) => {
	return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// handler
const handleStockMessage = async (message: Message) => {
	const {
		client,
		content,
		author: { bot, username },
	} = message

	// bot(webhook) check
	if (!bot) return

	// check log prefix
	const logPrefix = '[주식로그]'
	if (!content.includes(logPrefix)) return

	// parse data
	const stockLogStr = content.split(logPrefix)[1].split('[<t')[0].replace('\n', '')
	const stockLogArr = stockLogStr.split(',')

	// log obj
	const stockLog: StockDataType[] = []

	// parse log
	for (const log of stockLogArr) {
		const [name, value] = log.split(':')
		const [symbol, priceData] = value.split(' ')
		const [price, fluct] = priceData.split('|')

		// save
		stockLog.push({
			name,
			symbol: symbol === '▲' ? '🟢' : symbol === '▼' ? '🔴' : '🔶',
			price: formatWithCommas(price).replace('\\', ''),
			fluct: `${fluct}%`,
			fluctSymbol:
				symbol === '▲'
					? ':arrow_upper_right:'
					: symbol === '▼'
					? ':arrow_lower_right:'
					: ':arrow_right:',
		})
	}

	// send embed
	const pageLimit = 5
	if (stockLog.length > pageLimit) {
		// handle embed field length limit
		const tmpArr = stockLog.slice()
		let pageLength = Math.ceil(stockLog.length / pageLimit)

		// split data
		for (let i = 0; i < pageLength; i++) {
			const start = pageLimit * i
			const data = tmpArr.slice(start, pageLimit * (i + 1))

			// create embed
			const logEmbed = stockEmbed(data)

			// send embed message to log channel
			const channel = client.channels.cache.get(STOCK_LOG_CHANNEL_ID) as TextChannel
			channel.send({ embeds: [logEmbed] })
		}
	} else {
		// create embed
		const logEmbed = stockEmbed(stockLog)

		// send embed message to log channel
		const channel = client.channels.cache.get(STOCK_LOG_CHANNEL_ID) as TextChannel
		channel.send({ embeds: [logEmbed] })
	}

	// log
	logger.info(`[Stock] 주식 가격이 변동되었습니다!`)
}

export default handleStockMessage
