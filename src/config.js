require('dotenv').config();

function normalizePath(pathStr) {
    return (pathStr || '').replace(/\/$/, '');
}

const BASE_PATH = normalizePath(process.env.BASE_PATH);
const PROXY_PATH = normalizePath(process.env.PROXY_PATH) + BASE_PATH;

const config = {
    REDIS_PORT: process.env.REDIS_PORT || 6379,
    REDIS_HOST: process.env.REDIS_HOST || 'localhost',
    REDIS_DB: process.env.REDIS_DB || '0',
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    REDIS_USE_TLS: process.env.REDIS_USE_TLS,
    BULL_PREFIX: process.env.BULL_PREFIX || 'bull',
    BULL_VERSION: process.env.BULL_VERSION || 'BULLMQ',
    PORT: process.env.PORT || 3000,
    BASE_PATH: BASE_PATH,
    PROXY_PATH: PROXY_PATH,
    USER_LOGIN: process.env.USER_LOGIN,
    USER_PASSWORD: process.env.USER_PASSWORD,

    AUTH_ENABLED: Boolean(process.env.USER_LOGIN && process.env.USER_PASSWORD),
    HOME_PAGE: BASE_PATH || '/',
    LOGIN_PAGE: `${BASE_PATH}/login`,
    PROXY_HOME_PAGE: PROXY_PATH || '/',
    PROXY_LOGIN_PAGE: `${PROXY_PATH}/login`,
};

module.exports = config;
