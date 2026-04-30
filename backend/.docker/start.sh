#!/bin/sh

# Set default value for RUN_WORKER if not set
if [ -z "$RUN_WORKER" ]; then
    export RUN_WORKER=false
fi

# Optimization for Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations automatically
echo "Running database migrations..."
php artisan migrate --force

# Start supervisor
/usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
