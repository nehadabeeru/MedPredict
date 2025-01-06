# Frontend Dockerfile

FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies first
COPY package.json package-lock.json ./

# Install dependencies with legacy-peer-deps option
RUN npm install --legacy-peer-deps

# Copy the entire application code, including assets and source files
COPY . .

# Ensure the src/assets/images folder exists (useful for empty folders)
RUN mkdir -p /app/src/assets/images && touch /app/src/assets/images/.gitkeep

# Expose the port the React app runs on
EXPOSE 3000

# Start the React app
CMD ["npm", "start"]

