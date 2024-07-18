FROM node:20

WORKDIR /app

COPY package*.json ./

# Install both production and development dependencies
RUN npm install

# Install ts-node-dev globally
RUN npm install -g ts-node-dev

COPY . .

EXPOSE 8000

CMD ["npm", "run", "dev"]
