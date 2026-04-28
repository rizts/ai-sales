<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SalesPage extends Model
{
    protected $fillable = [
        'user_id',
        'product_name',
        'description',
        'target_audience',
        'status',
        'generated_content',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
