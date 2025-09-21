<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SuperadminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         User::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@zakat.com',
            'password' => Hash::make('password'), // Ganti dengan password yang aman
            'role' => User::ROLE_SUPERADMIN,
            'email_verified_at' => now(),
        ]);
    }
}
