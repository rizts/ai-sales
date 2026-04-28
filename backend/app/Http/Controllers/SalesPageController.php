<?php

namespace App\Http\Controllers;

use App\Jobs\GenerateSalesPageJob;
use App\Models\SalesPage;
use Illuminate\Http\Request;

class SalesPageController extends Controller
{
    public function index(Request $request)
    {
        $salesPages = $request->user()->salesPages()->orderBy('created_at', 'desc')->get();
        return response()->json($salesPages);
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_name' => 'required|string|max:255',
            'description' => 'required|string',
            'target_audience' => 'required|string|max:255',
        ]);

        $salesPage = $request->user()->salesPages()->create([
            'product_name' => $request->product_name,
            'description' => $request->description,
            'target_audience' => $request->target_audience,
            'status' => 'pending',
        ]);

        GenerateSalesPageJob::dispatch($salesPage);

        return response()->json($salesPage, 201);
    }

    public function show(Request $request, SalesPage $salesPage)
    {
        if ($request->user()->id !== $salesPage->user_id) {
            abort(403);
        }

        return response()->json($salesPage);
    }
}
