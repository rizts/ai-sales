#!/bin/sh

# Set default value for RUN_WORKER if not set
if [ -z "$RUN_WORKER" ]; then
    export RUN_WORKER=false
fi

# Optimization for Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations and seeders automatically
echo "Running database migrations and seeders..."
php artisan migrate --force --seed

# Ensure permissions are correct after artisan commands
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Start supervisor
/usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
