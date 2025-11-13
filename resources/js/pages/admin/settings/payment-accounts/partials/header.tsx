/**
 * @name Header
 * @description Komponen header untuk halaman Pengaturan Akun Pembayaran.
 * @returns {JSX.Element}
 */
const Header = () => {
    return (
        <div>
            <h1 className="text-xl font-bold">Pengaturan Akun Pembayaran</h1>
            <p className="text-sm text-muted-foreground">
                Atur detail akun dan instruksi pembayaran untuk berbagai metode
                yang tersedia.
            </p>
        </div>
    );
};

export default Header;
