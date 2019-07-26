FROM node:10.6.0

RUN mkdir /code
WORKDIR /code
COPY package*.json ./

RUN npm install
COPY . .

ENTRYPOINT ["/code/entry-point.sh"] 

