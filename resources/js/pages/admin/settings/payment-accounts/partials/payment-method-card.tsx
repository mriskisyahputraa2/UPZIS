import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    PaymentDetail,
    PaymentSettingsForm,
} from '@/types/payment-settings';
import { PlusCircle, Trash2 } from 'lucide-react';
import InputError from '@/components/input-error';

/**
 * @interface PaymentMethodCardProps
 * @description Properti untuk komponen PaymentMethodCard.
 */
interface PaymentMethodCardProps {
    methodKey: keyof PaymentSettingsForm;
    title: string;
    description?: string;
    accountLabel: string;
    nameLabel: string;
    data: PaymentDetail;
    setData: (
        field: keyof PaymentSettingsForm,
        value: PaymentDetail,
    ) => void;
    errors: Record<string, string>;
}

/**
 * @name PaymentMethodCard
 * @description Komponen kartu yang dapat digunakan kembali untuk mengelola satu metode pembayaran.
 * @param {PaymentMethodCardProps} props - Properti komponen.
 * @returns {JSX.Element}
 */
const PaymentMethodCard = ({
    methodKey,
    title,
    description,
    accountLabel,
    nameLabel,
    data,
    setData,
    errors,
}: PaymentMethodCardProps) => {
    // Mengelola perubahan pada input 'account' dan 'name'
    const handleInputChange = (field: 'account' | 'name', value: string) => {
        setData(methodKey, { ...data, [field]: value });
    };

    // Mengelola perubahan pada input langkah-langkah instruksi
    const handleStepChange = (index: number, value: string) => {
        const updatedSteps = [...data.steps];
        updatedSteps[index] = value;
        setData(methodKey, { ...data, steps: updatedSteps });
    };

    // Menambah langkah instruksi baru
    const addStep = () => {
        setData(methodKey, {
            ...data,
            steps: [...data.steps, ''],
        });
    };

    // Menghapus langkah instruksi
    const removeStep = (index: number) => {
        const updatedSteps = data.steps.filter((_, i) => i !== index);
        setData(methodKey, { ...data, steps: updatedSteps });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                {description && (
                    <CardDescription>{description}</CardDescription>
                )}
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor={`${methodKey}_account`}>
                        {accountLabel}
                    </Label>
                    <Input
                        id={`${methodKey}_account`}
                        value={data.account}
                        onChange={(e) =>
                            handleInputChange('account', e.target.value)
                        }
                    />
                    <InputError message={errors[`${methodKey}.account`]} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor={`${methodKey}_name`}>{nameLabel}</Label>
                    <Input
                        id={`${methodKey}_name`}
                        value={data.name}
                        onChange={(e) =>
                            handleInputChange('name', e.target.value)
                        }
                    />
                    <InputError message={errors[`${methodKey}.name`]} />
                </div>
                <div className="space-y-2">
                    <Label>Langkah-langkah Instruksi</Label>
                    {data.steps.map((step, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <Input
                                value={step}
                                onChange={(e) =>
                                    handleStepChange(index, e.target.value)
                                }
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeStep(index)}
                            >
                                <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                        </div>
                    ))}
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addStep}
                    >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Tambah Langkah
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default PaymentMethodCard;
