FROM node:lts-alpine

USER node

ENV NODE_ENV=production
ENV REDIS_HOST=localhost
ENV REDIS_PORT=6379
ENV REDIS_USE_TLS=false
ENV REDIS_PASSWORD=''
ENV BULL_PREFIX=bull
ENV BULL_VERSION=BULLMQ
ENV USER_LOGIN=''
ENV USER_PASSWORD=''
ENV REDIS_DB=0
ENV PROXY_PATH=''

ARG PORT=3000
ENV PORT $PORT
EXPOSE $PORT

WORKDIR /home/node/

COPY --chown=node:node ./package.json .
COPY --chown=node:node ./yarn.lock .

RUN yarn install --frozen-lockfile

COPY --chown=node:node ./src ./src

ENTRYPOINT ["yarn"]
CMD [ "start" ]
