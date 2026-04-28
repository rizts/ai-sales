<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SalesPage extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'input_data',
        'generated_content',
        'status',
    ];

    protected $casts = [
        'input_data' => 'array',
        'generated_content' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
