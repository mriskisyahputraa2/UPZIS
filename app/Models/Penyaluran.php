<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Penyaluran extends Model
{
    use HasFactory;

    protected $table = 'penyalurans'; // Nama tabel di database

    protected $fillable = ['permohonan_id', 'admin_id', 'amount', 'distribution_date', 'notes'];

    /**
     * Setiap penyaluran dimiliki oleh satu permohonan.
     */
    public function permohonan()
    {
        return $this->belongsTo(Permohonan::class);
    }

    /**
     * Setiap penyaluran dicatat oleh satu admin.
     */
    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }
}
