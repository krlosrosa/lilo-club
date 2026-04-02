#!/bin/sh
set -e
cd /app
node dist/infra/db/migrate.js
exec node dist/main.js
