FROM node:16.13.0

RUN mkdir /client
WORKDIR /client
COPY package*.json ./
COPY tsconfig.json ./
RUN npm i
COPY . .

CMD npm run start
