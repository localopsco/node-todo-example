#!/bin/sh

# Set DATABASE_URL environment variable
export DATABASE_URL="postgres://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=public"

# Check for NODE_ENV and run appropriate npm script
if [ "$NODE_ENV" = "development" ]; then
  exec npm run dev
else
  exec npm start
fi
