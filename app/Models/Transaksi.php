<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaksi extends Model
{
    use HasFactory;

    protected $table = 'transaksis'; // Nama tabel jamak

    protected $fillable = [
        'user_id',
        'order_id',
        'amount',
        'payment_method',
        'status',
        'midtrans_transaction_id',
        'snap_token',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
