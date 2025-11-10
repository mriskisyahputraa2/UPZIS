import PublicLayout from '@/layouts/publicLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import ConfirmationStep from './partials/create/ConfirmationStep';
import DocumentUploadForm from './partials/create/DocumentUploadForm';
import PersonalDataForm from './partials/create/PersonalDataForm';
import ProfilePhotoUpload from './partials/create/ProfilePhotoUpload';
import RegistrationClosed from './partials/create/RegistrationClosed';
import FormHeader from './partials/shared/FormHeader';

/**
 * Halaman utama untuk mengajukan permohonan bantuan.
 * Terdiri dari formulir multi-langkah untuk mengisi data diri,
 * mengunggah dokumen, dan konfirmasi.
 *
 * @param {object} props - Properti halaman.
 * @param {boolean} props.activePeriode - Status apakah periode pendaftaran aktif.
 * @returns {JSX.Element}
 */
export default function Create({ activePeriode }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        jenis_kelamin: '',
        nik: '',
        kk_number: '',
        phone_number: '',
        address: '',
        photo: null,
        file_ktp: null,
        file_kk: null,
        file_khs: null,
        file_surat_fakir_miskin: null,
        file_tidak_menerima_beasiswa: null,
        file_surat_permohonan: null,
    });

    const [previewImage, setPreviewImage] = useState(null);

    /**
     * Menangani pengiriman formulir.
     * @param {React.FormEvent<HTMLFormElement>} e - Event form.
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        post('/ajukan-bantuan');
    };

    /**
     * Memastikan input hanya menerima karakter numerik.
     * @param {React.ChangeEvent<HTMLInputElement>} e - Event input.
     * @param {string} fieldName - Nama field pada state form.
     */
    const handleNumericInput = (e, fieldName) => {
        const value = e.target.value.replace(/\D/g, '');
        setData(fieldName, value);
    };

    /**
     * Menangani perubahan pada input foto profil dan membuat pratinjau.
     * @param {React.ChangeEvent<HTMLInputElement>} e - Event input file.
     */
    const handlePhotoChange = (e) => {
        const file = e.target.files ? e.target.files[0] : null;
        setData('photo', file);
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
        } else {
            setPreviewImage(null);
        }
    };

    return (
        <PublicLayout>
            <Head title="Ajukan Bantuan" />

            <FormHeader
                title="Formulir Pengajuan Bantuan"
                description="Ikuti 4 langkah mudah untuk menyelesaikan pendaftaran Anda."
            />

            <section className="-mt-10 pb-24">
                <div className="container mx-auto max-w-4xl px-4">
                    {activePeriode ? (
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-8"
                            noValidate
                        >
                            <ProfilePhotoUpload
                                previewImage={previewImage}
                                handlePhotoChange={handlePhotoChange}
                                error={errors.photo}
                            />

                            <PersonalDataForm
                                data={data}
                                setData={setData}
                                handleNumericInput={handleNumericInput}
                                errors={errors}
                            />

                            <DocumentUploadForm
                                data={data}
                                setData={setData}
                                handleNumericInput={handleNumericInput}
                                errors={errors}
                            />

                            <ConfirmationStep processing={processing} />
                        </form>
                    ) : (
                        <RegistrationClosed />
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}