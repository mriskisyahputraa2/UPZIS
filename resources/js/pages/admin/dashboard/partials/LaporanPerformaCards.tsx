import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

// Helper function to format numbers into IDR currency format.
const formatCurrency = (value) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value || 0);

export default function LaporanPerformaCards({ performanceStats }) {
    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Card for Collected Funds */}
            <Card>
                <CardHeader>
                    <CardTitle>Dana Terkumpul (Sesuai Filter)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between rounded-md border p-3">
                        <span className="text-sm font-medium text-muted-foreground">
                            Zakat
                        </span>
                        <span className="font-semibold">
                            {formatCurrency(
                                performanceStats.danaTerkumpul.zakat,
                            )}
                        </span>
                    </div>
                    <div className="flex items-center justify-between rounded-md border p-3">
                        <span className="text-sm font-medium text-muted-foreground">
                            Infaq
                        </span>
                        <span className="font-semibold">
                            {formatCurrency(
                                performanceStats.danaTerkumpul.infaq,
                            )}
                        </span>
                    </div>
                    <div className="flex items-center justify-between rounded-md border p-3">
                        <span className="text-sm font-medium text-muted-foreground">
                            Sedekah
                        </span>
                        <span className="font-semibold">
                            {formatCurrency(
                                performanceStats.danaTerkumpul.sedekah,
                            )}
                        </span>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between bg-muted/50 p-4 font-bold">
                    <span>Total Terkumpul</span>
                    <span className="text-green-600">
                        {formatCurrency(performanceStats.danaTerkumpul.total)}
                    </span>
                </CardFooter>
            </Card>

            {/* Card for Distributed Funds */}
            <Card>
                <CardHeader>
                    <CardTitle>Dana Disalurkan (Sesuai Filter)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between rounded-md border p-3">
                        <span className="text-sm font-medium text-muted-foreground">
                            Zakat Kampus (Mahasiswa)
                        </span>
                        <span className="font-semibold">
                            {formatCurrency(
                                performanceStats.danaDisalurkan.kampus,
                            )}
                        </span>
                    </div>
                    <div className="flex items-center justify-between rounded-md border p-3">
                        <span className="text-sm font-medium text-muted-foreground">
                            Zakat (Fakir Miskin)
                        </span>
                        <span className="font-semibold">
                            {formatCurrency(
                                performanceStats.danaDisalurkan.fakir_miskin,
                            )}
                        </span>
                    </div>
                    <div className="flex items-center justify-between rounded-md border p-3">
                        <span className="text-sm font-medium text-muted-foreground">
                            Infaq & Sedekah
                        </span>
                        <span className="font-semibold">
                            {formatCurrency(
                                performanceStats.danaDisalurkan.infaq +
                                    performanceStats.danaDisalurkan.sedekah,
                            )}
                        </span>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between bg-muted/50 p-4 font-bold">
                    <span>Total Disalurkan</span>
                    <span className="text-red-600">
                        {formatCurrency(performanceStats.danaDisalurkan.total)}
                    </span>
                </CardFooter>
            </Card>
        </div>
    );
}
