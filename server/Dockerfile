FROM node:14 as server-builder

WORKDIR /usr/src/app/

COPY package*.json ./
RUN npm install

COPY . .

WORKDIR /usr/src/app/

EXPOSE 3001

CMD ["npm", "start"]