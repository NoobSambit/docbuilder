#!/bin/bash
# Robust build script with retry logic for Render deployment

set -e  # Exit on error

echo "Starting build process..."

# Maximum number of retry attempts
MAX_RETRIES=3
RETRY_DELAY=5

# Function to install packages with retry logic
install_with_retry() {
    local attempt=1

    while [ $attempt -le $MAX_RETRIES ]; do
        echo "Installation attempt $attempt of $MAX_RETRIES..."

        # Try to install with multiple fallback strategies
        if pip install --no-cache-dir --retries 5 --timeout 300 -r requirements.txt; then
            echo "Installation successful!"
            return 0
        else
            echo "Installation attempt $attempt failed"

            if [ $attempt -lt $MAX_RETRIES ]; then
                echo "Waiting $RETRY_DELAY seconds before retry..."
                sleep $RETRY_DELAY

                # Increase delay for next retry (exponential backoff)
                RETRY_DELAY=$((RETRY_DELAY * 2))
            fi

            attempt=$((attempt + 1))
        fi
    done

    echo "ERROR: Installation failed after $MAX_RETRIES attempts"
    return 1
}

# Upgrade pip first
echo "Upgrading pip..."
python -m pip install --upgrade pip setuptools wheel

# Configure pip for better reliability
echo "Configuring pip..."
pip config set global.timeout 300
pip config set global.retries 5

# Install packages with retry logic
install_with_retry

echo "Build completed successfully!"
