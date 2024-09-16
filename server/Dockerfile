# Use an official Node runtime as the parent image
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/server

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the current directory contents into the container
COPY . .

# Make port 4000 available to the world outside this container
EXPOSE 4000

# Add wait-for-it script
ADD https://github.com/vishnubob/wait-for-it/raw/master/wait-for-it.sh /usr/wait-for-it.sh
RUN chmod +x /usr/wait-for-it.sh

# Run DB migrations and start the app when the container launches
CMD ["/usr/wait-for-it.sh", "db:5432", "--", "npm", "run", "dev"]