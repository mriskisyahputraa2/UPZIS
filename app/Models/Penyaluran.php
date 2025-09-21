<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Penyaluran extends Model
{
    use HasFactory;

    protected $table = 'penyalurans'; // Nama tabel jamak

    protected $fillable = [
        'permohonan_id',
        'admin_id',
        'amount',
        'distribution_date',
        'notes',
    ];

    public function permohonan()
    {
        return $this->belongsTo(Permohonan::class);
    }

    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }
}
