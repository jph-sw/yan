#!/bin/sh
# docker-entrypoint.sh

# Ensure data directory exists (for local file mode)
mkdir -p /app/data

# If DATABASE_URL is not set or starts with "file:", ensure the SQLite file exists
if [ -z "$DATABASE_URL" ] || echo "$DATABASE_URL" | grep -q "^file:"; then
    # Extract the filename from DATABASE_URL or use default
    DB_FILE=${DATABASE_URL#file:} # Remove "file:" prefix if present
    DB_FILE=${DB_FILE:-./data/local.db} # Use default if not set

    # Remove leading ./ if present
    DB_FILE=${DB_FILE#./}

    # Ensure absolute path
    FULL_PATH="/app/$DB_FILE"

    # Create parent directory if it doesn't exist
    mkdir -p "$(dirname "$FULL_PATH")"
    touch "$FULL_PATH"
fi

# Run migrations
bun run dist/migrate.js

# Start the application
exec bun dist/server.js
