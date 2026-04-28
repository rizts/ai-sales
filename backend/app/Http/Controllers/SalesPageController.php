<?php

namespace App\Http\Controllers;

use App\Models\SalesPage;
use Illuminate\Http\Request;
use App\Jobs\GenerateSalesPage;
use Illuminate\Support\Facades\Gate;

class SalesPageController extends Controller
{
    public function index(Request $request)
    {
        $pages = $request->user()->salesPages()
            ->select('id', 'title', 'status', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($pages);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'product_name' => 'required|string',
            'description' => 'required|string',
            'key_features' => 'required|array',
            'key_features.*' => 'required|string',
            'target_audience' => 'required|string',
            'price' => 'required|string',
            'unique_selling_points' => 'required|string',
        ]);

        $inputData = collect($validated)->except('title')->toArray();

        $page = $request->user()->salesPages()->create([
            'title' => $validated['title'],
            'input_data' => $inputData,
            'status' => 'pending',
            'generated_content' => null,
        ]);

        GenerateSalesPage::dispatch($page);

        return response()->json($page, 201);
    }

    public function show(Request $request, $id)
    {
        $page = SalesPage::findOrFail($id);

        if ($page->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized action.');
        }

        return response()->json($page);
    }

    public function destroy(Request $request, $id)
    {
        $page = SalesPage::findOrFail($id);

        if ($page->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized action.');
        }

        $page->delete();

        return response()->json(['message' => 'Page deleted successfully']);
    }

    public function regenerate(Request $request, $id)
    {
        $page = SalesPage::findOrFail($id);

        if ($page->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized action.');
        }

        $page->update([
            'status' => 'pending',
            'generated_content' => null,
        ]);

        GenerateSalesPage::dispatch($page);

        return response()->json([
            'message' => 'Regeneration started',
            'page' => $page
        ]);
    }
}
