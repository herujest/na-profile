# Use official Node.js base image
FROM node:16-alpine

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies using Yarn
RUN yarn install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Build the Next.js app
RUN yarn build

# Expose the desired port
EXPOSE 5175

# Start the Next.js app
CMD ["yarn", "start"]
