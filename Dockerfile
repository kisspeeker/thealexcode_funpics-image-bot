FROM node

WORKDIR /app

COPY package.json /app

RUN yarn install

COPY . .

EXPOSE 4200

VOLUME [ "/app/data" ]

CMD [ "yarn", "serve" ]
