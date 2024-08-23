FROM oven/bun:alpine

RUN apk --no-cache add curl
RUN curl https://clickhouse.com/ | sh
RUN ./clickhouse install

WORKDIR /usr/app

COPY bun.lockb ./
COPY package.json ./
COPY . .

RUN bun i

EXPOSE 3000
EXPOSE 5173

CMD ["bun", "run", "dev"]