FROM node:15.8.0

RUN mkdir /code
WORKDIR /code

RUN apt-get update
RUN apt-get install netcat -y
RUN apt-get install -y vim

COPY package*.json ./
RUN npm install
COPY . .

RUN ["chmod", "+x", "/code/entry-point.sh"]
ENTRYPOINT ["/code/entry-point.sh"] 

