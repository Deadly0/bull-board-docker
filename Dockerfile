FROM node:12-alpine

WORKDIR /usr/app

COPY ./bullboard/package.json .
COPY ./bullboard/yarn.lock .

ENV NODE_ENV production
ENV REDIS_HOST localhost
ENV REDIS_PORT 6379
ENV REDIS_USE_TLS false
ENV REDIS_PASSWORD ''
ENV BULL_PREFIX bull

RUN yarn install

COPY ./bullboard .

ARG PORT=3000
ENV PORT $PORT
EXPOSE $PORT

CMD ["node", "index.js"]
