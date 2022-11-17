// packages
import * as mongoose from 'mongoose'

// logger
import logger from '../../winston/winston.js'

// get config
import * as config from '../config/config'
const { MONGO_URI } = config

// connect database
const connectDB = () => {
	mongoose
		.connect(MONGO_URI as string)
		.then(() => {
			logger.info('[Mongoose] Database connected.')
		})
		.catch((e) => {
			logger.error('[Mongoose] Failed to connect database.')
			logger.error(`[Mongoose] ${e}`)
		})
}

export default connectDB
