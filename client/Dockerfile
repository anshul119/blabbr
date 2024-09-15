# Build stage
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/client

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the current directory contents into the container
COPY . .

# Expose the port React runs on
EXPOSE 3000

# Set environment to development
ENV NODE_ENV=development

# Start the development server
CMD ["npm", "start"]