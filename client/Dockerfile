FROM node:alpine

# Create a non-root user
RUN addgroup -g 1001 -S appuser && adduser -u 1001 -S appuser -G appuser

WORKDIR /app/client

COPY package*.json ./
RUN npm install --ignore-scripts

# Change ownership of the app directory to the non-root user
COPY --chown=appuser:appuser . .

USER appuser

CMD ["npm", "run", "dev"]
