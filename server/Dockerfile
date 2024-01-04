FROM node:latest

WORKDIR /app/server

COPY package*.json ./
RUN npm install --ignore-scripts

COPY . .

EXPOSE 3001

CMD ["npm", "start"]