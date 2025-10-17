#!/bin/sh
# docker-entrypoint.sh

set -e

# Ensure data directory exists (for local file mode)
mkdir -p /app/data

# If DATABASE_URL is not set or starts with "file:", ensure the SQLite file exists
if [ -z "$DATABASE_URL" ] || echo "$DATABASE_URL" | grep -q "^file:"; then
    # Extract the filename from DATABASE_URL or use default
    DB_FILE=${DATABASE_URL#file:} # Remove "file:" prefix if present
    DB_FILE=${DB_FILE:-data/local.db} # Use default if not set

    # Remove leading ./ if present
    DB_FILE=${DB_FILE#./}

    # Ensure it doesn't start with / (make it relative to /app)
    DB_FILE=${DB_FILE#/}

    # Create full path
    FULL_PATH="/app/$DB_FILE"

    # Create parent directory if it doesn't exist
    mkdir -p "$(dirname "$FULL_PATH")"
    touch "$FULL_PATH"

    # Set proper permissions
    chmod 664 "$FULL_PATH"
    chown bun:bun "$FULL_PATH"

    echo "Database file initialized at: $FULL_PATH"
fi

# Run migrations with proper error handling
echo "Running database migrations..."
if ! bun run dist/migrate.js; then
    echo "Migration failed! Exiting..."
    exit 1
fi

# Function to handle graceful shutdown
shutdown_handler() {
    echo "Received shutdown signal, stopping processes..."
    if [ -n "$SERVER_PID" ]; then
        kill -TERM "$SERVER_PID" 2>/dev/null || true
        wait "$SERVER_PID" 2>/dev/null || true
    fi
    exit 0
}

# Set up signal handlers for POSIX-compliant shells
trap shutdown_handler INT TERM

# Start the main server in the background
echo "Starting main server..."
bun dist/server.js &
SERVER_PID=$!

# Wait for the server process
wait "$SERVER_PID"
