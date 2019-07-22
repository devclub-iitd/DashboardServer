FROM node:latest

RUN mkdir /code
WORKDIR /code
COPY package*.json ./

RUN npm install
COPY . .

RUN npm run build-ts

RUN npm run watch-node

EXPOSE 3000
