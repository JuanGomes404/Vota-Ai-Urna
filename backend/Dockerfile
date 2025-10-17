FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY database/package*.json ./database/

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
