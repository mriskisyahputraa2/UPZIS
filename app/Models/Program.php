<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Program extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'status', 'description', 'program_date'];

    /**
     * Sebuah program memiliki BANYAK foto dokumentasi.
     */
    public function photos()
    {
        return $this->hasMany(ProgramPhoto::class);
    }

    /**
     * Sebuah program terdiri dari BANYAK catatan penyaluran.
     * Ini adalah relasi kunci untuk menghitung total dana.
     */
    public function penyalurans()
    {
        return $this->hasMany(Penyaluran::class);
    }
}
