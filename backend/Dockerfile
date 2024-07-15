FROM node:20-alpine

# Required envs
ENV PORT=3001
ENV NODE_ENV=production
ENV S3_REGION=
ENV S3_BUCKET_NAME=
ENV AWS_ACCESS_KEY_ID=
ENV AWS_SECRET_ACCESS_KEY=
ENV DB_HOST=host.docker.internal
ENV DB_PORT=5432
ENV DB_USER=postgres
ENV DB_PASS=postgres
ENV DB_NAME=todo_app

# optional envs
ENV FRAMEWORK=node
ENV APP_VERSION=1.1.1
ENV TECH_STACK='Node.JS (Express), Postgres, Redis, React.JS'
ENV CLOUD_DEPENDENCIES='AWS S3'

WORKDIR /app

ENV DATABASE_URL=postgres://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=public

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
COPY prisma ./
RUN npm ci

COPY . .
EXPOSE ${PORT}

CMD ["npm", "run", "start"]
