<?php

namespace App\Services\User;

use App\Repositories\User\ContactRepository;
use Illuminate\Support\Facades\DB;

class ContactService
{
    /**
     * @var ContactRepository
     */
    protected $contactRepository;

    /**
     * ContactService constructor.
     *
     * @param  ContactRepository  $contactRepository
     */
    public function __construct(ContactRepository $contactRepository)
    {
        $this->contactRepository = $contactRepository;
    }

    /**
     * Menyimpan data kontak baru.
     *
     * @param  array  $data
     * @return \App\Models\Contact
     *
     * @throws \Exception
     */
    public function createContact(array $data)
    {
        DB::beginTransaction();

        try {
            $contact = $this->contactRepository->create($data);
            DB::commit();

            return $contact;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
