<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Periode extends Model
{
    use HasFactory;

    protected $table = 'periodes'; // Nama tabel jamak

    protected $fillable = [
        'name',
        'description',
        'start_date',
        'end_date',
        'status',
    ];

    public function permohonans()
    {
        return $this->hasMany(Permohonan::class);
    }

    public function programs()
    {
        return $this->hasMany(Program::class);
    }
}
