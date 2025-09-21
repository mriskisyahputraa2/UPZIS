<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Program extends Model
{
    use HasFactory;

    protected $fillable = [
        'periode_id',
        'name',
        'description',
        'total_funds_distributed',
        'program_date',
    ];

    public function periode()
    {
        return $this->belongsTo(Periode::class);
    }

    public function photos()
    {
        return $this->hasMany(ProgramPhoto::class);
    }
}
