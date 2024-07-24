FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Install both production and development dependencies
RUN npm ci

# Install ts-node globally
RUN npm install -g ts-node tsconfig-paths

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
