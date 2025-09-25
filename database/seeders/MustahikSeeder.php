<?php

namespace Database\Seeders;

use App\Models\Mustahik;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MustahikSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Mustahik::factory()->count(25)->create();
    }
}
