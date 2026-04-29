<?php

namespace App\Jobs;

use App\Models\SalesPage;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GenerateSalesPage implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $page;
    public $timeout = 120; // Allow 2 minutes for API call

    /**
     * Create a new job instance.
     */
    public function __construct(SalesPage $page)
    {
        $this->page = $page;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $this->page->update(['status' => 'processing']);

        try {
            $systemPrompt = 'You are a marketing copywriter. Return ONLY a valid JSON object with no explanation, no markdown, no code fences. Keys required: headline (string), sub_headline (string), product_description (string), benefits (array of strings), features_breakdown (array of {title, description}), social_proof_placeholder (string), pricing_display (string), call_to_action (string)';
            
            $userPrompt = json_encode($this->page->input_data);

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . env('OPENROUTER_API_KEY'),
                'Content-Type' => 'application/json',
            ])->timeout(60)->post('https://openrouter.ai/api/v1/chat/completions', [
                'model' => 'meta-llama/llama-3.3-70b-instruct:free',
                'messages' => [
                    ['role' => 'system', 'content' => $systemPrompt],
                    ['role' => 'user', 'content' => "Generate copy based on this data: " . $userPrompt],
                ],
            ]);

            if ($response->successful()) {
                $content = $response->json('choices.0.message.content');
                
                // Sometimes LLMs return markdown block even when told not to. Clean it up just in case.
                $content = str_replace(['```json', '```'], '', $content);
                $content = trim($content);
                
                $parsedContent = json_decode($content, true);
                
                if (json_last_error() === JSON_ERROR_NONE && is_array($parsedContent)) {
                    $this->page->update([
                        'generated_content' => $parsedContent,
                        'status' => 'done',
                    ]);
                } else {
                    Log::error("Failed to parse JSON from LLM: " . $content);
                    $this->page->update([
                        'status' => 'failed',
                        'generated_content' => ['error' => 'Failed to parse AI response into valid JSON']
                    ]);
                }
            } else {
                Log::error("OpenRouter API error: " . $response->body());
                $errorMsg = $response->json('error.message') ?? 'Unknown OpenRouter API Error';
                if (isset($response->json('error')['metadata']['raw'])) {
                    $errorMsg = $response->json('error')['metadata']['raw'];
                }
                $this->page->update([
                    'status' => 'failed',
                    'generated_content' => ['error' => $errorMsg]
                ]);
            }
        } catch (\Exception $e) {
            Log::error("Exception in GenerateSalesPage job: " . $e->getMessage());
            $this->page->update([
                'status' => 'failed',
                'generated_content' => ['error' => $e->getMessage()]
            ]);
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        $this->page->update(['status' => 'failed']);
    }
}
