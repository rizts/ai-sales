<?php

namespace App\Jobs;

use App\Models\SalesPage;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GenerateSalesPageJob implements ShouldQueue
{
    use Queueable;

    public $salesPage;

    /**
     * Create a new job instance.
     */
    public function __construct(SalesPage $salesPage)
    {
        $this->salesPage = $salesPage;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $this->salesPage->update(['status' => 'processing']);

        $prompt = "Write a high-converting sales page for a product named '{$this->salesPage->product_name}'.\n\n";
        $prompt .= "Description: {$this->salesPage->description}\n";
        $prompt .= "Target Audience: {$this->salesPage->target_audience}\n\n";
        $prompt .= "Please use markdown formatting. Include a catchy headline, benefits, features, and a call to action.";

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . env('OPENROUTER_API_KEY'),
                'HTTP-Referer' => env('APP_URL'), // Optional, for OpenRouter rankings
                'X-Title' => config('app.name'), // Optional, for OpenRouter rankings
            ])->post('https://openrouter.ai/api/v1/chat/completions', [
                'model' => 'meta-llama/llama-3.3-70b-instruct:free',
                'messages' => [
                    ['role' => 'user', 'content' => $prompt]
                ],
            ]);

            if ($response->successful()) {
                $content = $response->json('choices.0.message.content');
                $this->salesPage->update([
                    'status' => 'completed',
                    'generated_content' => $content,
                ]);
            } else {
                Log::error('OpenRouter API Error', ['response' => $response->body()]);
                $this->salesPage->update(['status' => 'failed']);
            }
        } catch (\Exception $e) {
            Log::error('GenerateSalesPageJob Error', ['message' => $e->getMessage()]);
            $this->salesPage->update(['status' => 'failed']);
        }
    }
}
