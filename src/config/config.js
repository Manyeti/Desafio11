import dotenv from 'dotenv';
import logger from '../utils/logger.js';

const enviroment = "PRODUCTION"

dotenv.config({
    path: enviroment === "PRODUCTION" ? '../.env.production' : '../.env.development'
})

export default {
    port: process.env.PORT,
    mongoURL: process.env.MONGO_URL,
    user: process.env.USER,
    password: process.env.PASSWORD
}