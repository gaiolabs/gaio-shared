FROM oven/bun:1.1.25-alpine

EXPOSE 5173

LABEL maintainer="tuliomitico <https://github.com/tuliomitico>"

VOLUME ["/var/gaioweb"]

RUN apk add bash
RUN apk add nodejs

WORKDIR /usr/app

COPY . .

RUN bun i

CMD ["bun", "run", "dev"]

