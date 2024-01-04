FROM node:alpine

WORKDIR /app/client

COPY package*.json ./
RUN npm install --ignore-scripts

COPY . .

CMD ["npm", "run", "dev"]