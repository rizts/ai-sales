<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\SalesPage;
use App\Jobs\GenerateSalesPage;

$user = User::first();

if (!$user) {
    echo "No user found.\n";
    exit;
}

$page = SalesPage::create([
    'user_id' => $user->id,
    'title' => 'Test Promo',
    'input_data' => [
        'product_name' => 'SuperWidget',
        'description' => 'A widget that does super things.',
        'key_features' => ['Fast', 'Reliable'],
        'target_audience' => 'Tech enthusiasts',
        'price' => '$99',
        'unique_selling_points' => 'It is the only widget you will ever need.',
    ],
    'status' => 'pending',
]);

echo "Created page ID: {$page->id}\n";
GenerateSalesPage::dispatch($page);
echo "Job dispatched.\n";
