<?php

namespace App\Repositories\User;

use App\Models\Contact;

class ContactRepository
{
    /**
     * @var Contact
     */
    protected $contact;

    /**
     * ContactRepository constructor.
     *
     * @param  Contact  $contact
     */
    public function __construct(Contact $contact)
    {
        $this->contact = $contact;
    }

    /**
     * Menyimpan data kontak baru.
     *
     * @param  array  $data
     * @return Contact
     */
    public function create(array $data): Contact
    {
        return $this->contact->create($data);
    }
}
