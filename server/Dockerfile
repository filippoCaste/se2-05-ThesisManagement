FROM node:latest

# Create a non-root user
RUN addgroup -g 1001 -S appuser && adduser -u 1001 -S appuser -G appuser

WORKDIR /app/server

COPY package*.json ./
RUN npm install --ignore-scripts

# Change ownership of the app directory to the non-root user
COPY --chown=appuser:appuser . .

USER appuser

EXPOSE 3001

CMD ["npm", "start"]
