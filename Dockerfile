FROM node:16-alpine

WORKDIR /app

COPY package.json /app

RUN yarn install --network-timeout 100000

COPY . .

EXPOSE 80

VOLUME [ "/app/data" ]

CMD [ "yarn", "start" ]
