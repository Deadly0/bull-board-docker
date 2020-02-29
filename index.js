const {createQueues, UI} = require('bull-board');
const express = require('express');
const redis = require('redis');

const redisConfig = {
	redis: {
		port: process.env.REDIS_PORT,
		host: process.env.REDIS_HOST,
		password: process.env.REDIS_PASSWORD,
		tls: process.env.REDIS_USE_TLS === 'true',
	},
};

const client = redis.createClient(redisConfig.redis);
const prefix = process.env.BULL_PREFIX;
const port = process.env.PORT;
const queue = createQueues(redisConfig);

client.KEYS(`${prefix}:*`, (err, keys) => {
	const uniqKeys = new Set(keys.map(key => key.replace(/^.+?:(.+?):.+?$/, '$1')));

	uniqKeys.forEach((item) => {
		queue.add(item);
	});
});

const app = express();

app.use('/', UI);
app.listen(port, () => {
	console.log(`bull-board listening on port ${port}!`);
});
