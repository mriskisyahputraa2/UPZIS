<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProgramPhoto extends Model
{
    use HasFactory;

    protected $table = 'program_photos'; // Nama tabel jamak

    protected $fillable = [
        'program_id',
        'photo_path',
        'caption',
    ];

    public function program()
    {
        return $this->belongsTo(Program::class);
    }
}
