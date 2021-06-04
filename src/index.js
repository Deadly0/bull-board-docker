const {createBullBoard} = require('@bull-board/api');
const {BullAdapter} = require('@bull-board/api/bullAdapter');
const {BullMQAdapter} = require('@bull-board/api//bullMQAdapter');
const {ExpressAdapter} = require('@bull-board/express');
const { isDeepStrictEqual } = require('util')
const Queue = require('bull');
const bullmq = require('bullmq');
const express = require('express');
const redis = require('redis');
const session = require('express-session');
const passport = require('passport');
const {ensureLoggedIn} = require('connect-ensure-login');
const bodyParser = require('body-parser');

const {authRouter} = require('./login');
const config = require('./config');

const redisConfig = {
	redis: {
		port: config.REDIS_PORT,
		host: config.REDIS_HOST,
		db: config.REDIS_DB,
		...(config.REDIS_PASSWORD && {password: config.REDIS_PASSWORD}),
		tls: config.REDIS_USE_TLS === 'true',
	},
};

const serverAdapter = new ExpressAdapter();
const client = redis.createClient(redisConfig.redis);
const { setQueues, replaceQueues } = createBullBoard({queues: [], serverAdapter});
const router = serverAdapter.getRouter();

let lastValidQueues = null

const createAdapters = (queues) => queues.map(
	(item) => {
		if (config.BULL_VERSION === 'BULLMQ') {
			return new BullMQAdapter(new bullmq.Queue(item, {connection: redisConfig.redis}));
		}

		return new BullAdapter(new Queue(item, redisConfig));
	}
);

client.KEYS(`${config.BULL_PREFIX}:*`, (err, keys) => {
	const uniqKeys = new Set(keys.map(key => key.replace(/^.+?:(.+?):.+?$/, '$1')));
	const actualQueues = Array.from(uniqKeys).sort();
	lastValidQueues = actualQueues;
	const queueList = createAdapters(actualQueues);

	setQueues(queueList);
	console.log('done!');
});

const updateQueues = () => {
	client.KEYS(`${config.BULL_PREFIX}:*`, (err, keys) => {
		const uniqKeys = new Set(keys.map(key => key.replace(/^.+?:(.+?):.+?$/, '$1')));
		const actualQueues = Array.from(uniqKeys).sort();
		if (isDeepStrictEqual(lastValidQueues, actualQueues)) return;

		lastValidQueues = actualQueues;
		const queueList = createAdapters(actualQueues);
	
		replaceQueues(queueList);
		console.log('detected queue change, updating UI');
	});
}

const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

if (app.get('env') !== 'production') {
	const morgan = require('morgan');
	app.use(morgan('combined'));
}

app.use((req, res, next) => {
	if (config.PROXY_PATH) {
		req.proxyUrl = config.PROXY_PATH;
	}

	next();
});

const sessionOpts = {
	name: 'bull-board.sid',
	secret: Math.random().toString(),
	resave: false,
	saveUninitialized: false,
	cookie: {
		path: '/',
		httpOnly: false,
		secure: false
	}
};

app.use(session(sessionOpts));
app.use(passport.initialize({}));
app.use(passport.session({}));
app.use(bodyParser.urlencoded({extended: false}));

if (config.AUTH_ENABLED) {
	app.use(config.LOGIN_PAGE, authRouter);
	app.use(config.HOME_PAGE, ensureLoggedIn(config.LOGIN_PAGE), router);
} else {
	app.use(config.HOME_PAGE, router);
}

let updateQueuesInterval = null
const gracefullyShutdown = () => clearInterval(updateQueuesInterval)

app.listen(config.PORT, () => {
	console.log(`bull-board is started http://localhost:${config.PORT}${config.HOME_PAGE}`);
	console.log(`bull-board is fetching queue list, please wait...`);

	// poor man queue update process
	updateQueuesInterval = setInterval(updateQueues, 60 * 1000)
	process.on('SIGINT', gracefullyShutdown)
	process.on('SIGTERM', gracefullyShutdown)
});
