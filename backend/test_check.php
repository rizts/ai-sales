<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\SalesPage;

$page = SalesPage::find(1);
echo "Status: " . $page->status . "\n";
echo "Generated Content:\n";
print_r($page->generated_content);
