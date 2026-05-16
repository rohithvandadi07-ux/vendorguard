FROM node:18-alpine

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 80

# Command to run dev server
# Note: For production we would run `npm run build` and serve via nginx.
# Using Vite dev server for simplicity to ensure immediate startup with hot reload.
CMD ["npm", "run", "dev"]
