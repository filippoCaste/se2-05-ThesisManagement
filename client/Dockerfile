FROM node:14 as client-builder

WORKDIR /usr/src/app/

COPY package*.json ./
RUN npm install

COPY . .

WORKDIR /usr/src/app/

EXPOSE 5173

CMD ["npm", "run", "dev"]
