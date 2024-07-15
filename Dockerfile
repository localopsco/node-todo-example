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
ENV APP_VERSION=0.0.0
ENV TECH_STACK='Node.JS (Express), Postgres, Redis, React.JS'
ENV CLOUD_DEPENDENCIES='AWS S3'

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
COPY prisma ./

RUN npm ci

COPY . .
EXPOSE ${PORT}

COPY start.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/start.sh

ENTRYPOINT [ "start.sh" ]
