FROM node:current

WORKDIR /apricot/node-backend

COPY package*.json ./

RUN npm install

RUN npm install -g nodemon

COPY . .

EXPOSE 5000

CMD [ "npm", "start" ]

