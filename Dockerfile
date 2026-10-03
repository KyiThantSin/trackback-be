FROM node:26-alpine AS base

WORKDIR /app

RUN npm install --global yarn@1.22.22

# Copy dependency manifests
COPY package.json yarn.lock ./

# ---------- development (used by docker compose) ----------
FROM base AS dev

# Install dependency
RUN yarn install --frozen-lockfile && yarn cache clean

# Copy source code and config files
COPY tsconfig.json ./
COPY prisma.config.ts ./
COPY src ./src
COPY prisma ./prisma

# Emit the Prisma 8 contract artifacts used by the application.
RUN yarn contract:emit

EXPOSE 8080

CMD [ "yarn", "dev" ]

# ---------- build ----------
FROM dev AS build

RUN yarn build

# ---------- production ----------
FROM base AS prod

ENV NODE_ENV=production

RUN yarn install --frozen-lockfile --production && yarn cache clean

COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

EXPOSE 8080

#run app
USER node
CMD [ "node", "dist/app.js"]