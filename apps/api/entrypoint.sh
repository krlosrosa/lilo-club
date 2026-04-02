#!/bin/sh
set -e
cd /app
mkdir -p /app/data
node dist/infra/db/migrate.js
exec node dist/main.js
