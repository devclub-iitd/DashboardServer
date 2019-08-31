FROM node:10.6.0

RUN mkdir /code
WORKDIR /code
COPY package*.json ./

RUN apt-get update
RUN apt-get install netcat -y

RUN npm install
COPY . .

ENTRYPOINT ["/code/entry-point.sh"] 

