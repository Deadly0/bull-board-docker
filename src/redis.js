import { createClient } from 'redis';
import {config} from "./config";

export const redisConfig = {
	redis: {
		port: config.REDIS_PORT,
		host: config.REDIS_HOST,
		db: config.REDIS_DB,
		...(config.REDIS_PASSWORD && {password: config.REDIS_PASSWORD}),
		tls: config.REDIS_USE_TLS === 'true',
	},
};

export const client = createClient(redisConfig.redis);
client.on('error', err => console.log('Redis Client Error', err));
