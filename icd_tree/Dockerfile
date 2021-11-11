FROM node:16.13.0-buster

WORKDIR /path

COPY package.json /path/package.json
COPY package-lock.json /path/package-lock.json

RUN npm install

COPY . .

CMD ["npm", "start"]

