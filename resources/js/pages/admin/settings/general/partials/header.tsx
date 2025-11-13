/**
 * @name Header
 * @description Komponen header untuk halaman Pengaturan Umum.
 * @returns {JSX.Element}
 */
const Header = () => {
    return (
        <div>
            <h1 className="text-xl font-bold">Pengaturan Umum</h1>
            <p className="text-sm text-muted-foreground">
                Atur konfigurasi dasar dan informasi kontak untuk aplikasi Anda.
            </p>
        </div>
    );
};

export default Header;
