FROM node:26-alpine AS builder

WORKDIR /app

RUN npm install --global yarn@1.22.22

# Copy dependency manifests
COPY package.json yarn.lock ./

# Install dependency
RUN yarn install --frozen-lockfile

# Copy source code and config files
COPY tsconfig.json ./
COPY prisma.config.ts ./
COPY src ./src
COPY prisma ./prisma

# Emit the Prisma 8 contract artifacts used by the application.
RUN yarn contract:emit
RUN yarn build

EXPOSE 8080

#run app
CMD [ "node", "dist/app.js"]
