[![License](https://img.shields.io/github/license/Addono/bull-board-docker?style=flat-square)](https://github.com/Addono/bull-board-docker/blob/master/LICENSE)
[![Project Status: Active – The project has reached a stable, usable state and is being actively developed.](https://img.shields.io/badge/project%20status-Active-greengrass?style=flat-square)](https://www.repostatus.org/#active)
![GitHub Workflow Status - Docker](https://img.shields.io/github/actions/workflow/status/Addono/bull-board-docker/docker-publish.yml?style=flat-square)
[
![Docker Image Pulls (all-time)](https://img.shields.io/docker/pulls/addono/bull-board?style=flat-square)
![Docker Image Version (latest semver)](https://img.shields.io/docker/v/addono/bull-board?sort=semver&style=flat-square)
](https://hub.docker.com/r/addono/bull-board)

Docker image for [bull-board]. Allow you to monitor your bull queue without any coding!

Supports both: Bull and BullMQ.

### Quick start with Docker

```
docker run -p 3000:3000 addono/bull-board
```
will run bull-board interface on `localhost:3000` and connect to your redis instance on `localhost:6379` without password.

To configurate redis see "Environment variables" section.

### Quick start with docker-compose
```yaml
version: '3.5'

services:
  bullboard:
    container_name: bullboard
    image: addono/bull-board
    restart: always
    ports:
      - 3000:3000
```
will run bull-board interface on `localhost:3000` and connect to your redis instance on `localhost:6379` without password.

see "Example with docker-compose" section for example with env parameters


### Environment variables
* `REDIS_HOST` - host to connect to redis (localhost by default)
* `REDIS_PORT` - redis port (6379 by default)
* `REDIS_DB` - redis db to use ('0' by default)
* `REDIS_USE_TLS` - enable TLS true or false (false by default)
* `REDIS_PASSWORD` - password to connect to redis (no password by default)
* `BULL_PREFIX` - prefix to your bull queue name (bull by default)
* `BULL_VERSION` - version of bull lib to use 'BULLMQ' or 'BULL' ('BULLMQ' by default)
* `PROXY_PATH` - proxyPath for bull board, e.g. https://<server_name>/my-base-path/queues [docs] ('' by default)
* `USER_LOGIN` - login to restrict access to bull-board interface (disabled by default)
* `USER_PASSWORD` - password to restrict access to bull-board interface (disabled by default)


### Restrict access with login and password

To restrict access to bull-board use `USER_LOGIN` and `USER_PASSWORD` env vars.
Only when both `USER_LOGIN` and `USER_PASSWORD` specified, access will be restricted with login/password


### Example with docker-compose
```yaml
version: '3.5'

services:
  redis:
    container_name: redis
    image: redis:5.0-alpine
    restart: always
    ports:
      - 6379:6379
    volumes:
      - redis_db_data:/data

  bullboard:
    container_name: bullboard
    image: addono/bull-board
    restart: always
    ports:
      - 3000:3000
    environment:
      REDIS_HOST: redis
      REDIS_PORT: 6379
      REDIS_PASSWORD: example-password
      REDIS_USE_TLS: 'false'
      BULL_PREFIX: bull
    depends_on:
      - redis

volumes:
  redis_db_data:
    external: false
```

[bull-board]: https://github.com/felixmosh/bull-board
