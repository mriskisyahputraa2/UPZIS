<?php

namespace App\Services\Admin;

use App\Models\Contact;

class AdminContactService
{
    /**
     * Menandai pesan sebagai 'Sudah Dibaca' jika statusnya masih 'Baru'.
     *
     * @param Contact $contact
     * @return Contact
     */
    public function markAsRead(Contact $contact): Contact
    {
        // Memindahkan logika "if status is new" ke sini.
        if ($contact->status === 'Baru') {
            $contact->update(['status' => 'Sudah Dibaca']);
            $contact->refresh();
        }

        return $contact;
    }

    /**
     * Menghapus pesan dari database.
     *
     * @param Contact $contact
     * @return void
     */
    public function deleteContact(Contact $contact): void
    {
        // Memindahkan logika penghapusan ke sini.
        $contact->delete();
    }
}
