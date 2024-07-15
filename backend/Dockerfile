FROM node:20-alpine AS base

# Required envs
ENV PORT=3001
ENV NODE_ENV=production
ENV AWS_REGION=
ENV S3_BUCKET_NAME=
ENV S3_BUCKET_NAME=
ENV AWS_ACCESS_KEY_ID=
ENV AWS_SECRET_ACCESS_KEY=

# optional envs
ENV FRAMEWORK=node
ENV APP_VERSION=1.1.1
ENV TECH_STACK='Node.JS (Express), Postgres, Redis, React.JS'
ENV CLOUD_DEPENDENCIES='AWS S3'

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
COPY prisma ./
RUN npm ci

COPY . .
EXPOSE ${PORT}

FROM base AS development

CMD ["npm" ,"run", "dev"]

FROM base AS production

CMD ["npm", "run", "start"]
