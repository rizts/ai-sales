<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\SalesPage;

$page = SalesPage::create([
    'user_id' => 1,
    'title' => 'Test Promo Done',
    'input_data' => [
        'product_name' => 'SuperWidget',
    ],
    'status' => 'done',
    'generated_content' => [
        'headline' => 'The Best Widget Ever Made',
        'sub_headline' => 'SuperWidget will change your life forever. Get it now.',
        'product_description' => 'This widget does super things that no other widget can do. It is crafted with precision and care, bringing you the ultimate widget experience.',
        'benefits' => [
            'Saves 10 hours a week',
            'Increases revenue by 200%',
            'Makes you look really cool',
        ],
        'features_breakdown' => [
            ['title' => 'Fast Speed', 'description' => 'It works in milliseconds.'],
            ['title' => 'High Reliability', 'description' => '99.99% uptime guaranteed.'],
        ],
        'social_proof_placeholder' => 'I love SuperWidget! It changed my life. - John Doe',
        'pricing_display' => '$99 / month',
        'call_to_action' => 'Get Started Today',
    ],
]);

echo "Created page ID: {$page->id}\n";
