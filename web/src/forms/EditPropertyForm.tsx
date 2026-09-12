import React, { useState, useMemo } from 'react';
import { Save } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { TextField } from '../components/ui/TextField';
import type { PropertyData } from '../types';
import { Select } from '../components/ui';

type InstallmentFrequency = 'monthly' | 'quarterly' | 'semiannual' | 'yearly';

const FREQUENCY_OPTIONS: { value: InstallmentFrequency; label: string; intervalMonths: number }[] = [
    { value: 'monthly', label: 'Monthly', intervalMonths: 1 },
    { value: 'quarterly', label: 'Every 3 Months', intervalMonths: 3 },
    { value: 'semiannual', label: 'Every 6 Months', intervalMonths: 6 },
    { value: 'yearly', label: 'Yearly', intervalMonths: 12 },
];

interface EditPropertyFormProps {
    initialData: PropertyData;
    onSave: (data: PropertyData) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

const ReadOnlyField: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div>
        <label className="block text-sm font-medium text-foreground dark:text-white mb-1">
            {label}
        </label>
        <div className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground">
            {value}
        </div>
    </div>
);

// Adds `months` to an ISO date string, returning an ISO date string.
const addMonthsISO = (iso: string, months: number): string | null => {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return null;
    d.setMonth(d.getMonth() + months);
    return d.toISOString().slice(0, 10);
};

export const EditPropertyForm: React.FC<EditPropertyFormProps> = ({
    initialData,
    onSave,
    onCancel,
    isLoading = false,
}) => {
    const [formData, setFormData] = useState<PropertyData>(() => ({
        ...initialData,
        isParkFace: Boolean(initialData.isParkFace),
        parkFaceCharges: Number(initialData.parkFaceCharges) || 0,
        isCorner: Boolean(initialData.isCorner),
        cornerCharges: Number(initialData.cornerCharges) || 0,
        downPayment: Number(initialData.downPayment) || 0,
        installmentFrequency: initialData.installmentFrequency ?? 'monthly',
        planYears: Number(initialData.planYears) || 1,
        planStartDate: initialData.planStartDate || new Date().toISOString().slice(0, 10),
    }));

    // ---------- Input handlers ----------
    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        if (type === 'number') {
            const n = parseFloat(value);
            setFormData(prev => ({ ...prev, [name]: isNaN(n) ? 0 : n }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFrequencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, installmentFrequency: e.target.value as InstallmentFrequency }));
    };

    // ---------- Pricing calculation ----------
    const newMarlaRate = useMemo(() => {
        const rate = Number(formData.ratePerMarla) || 0;
        const cornerPct = formData.isCorner ? (Number(formData.cornerCharges) || 0) : 0;
        const parkPct = formData.isParkFace ? (Number(formData.parkFaceCharges) || 0) : 0;
        return rate + rate * (cornerPct / 100) + rate * (parkPct / 100);
    }, [formData.ratePerMarla, formData.isCorner, formData.cornerCharges, formData.isParkFace, formData.parkFaceCharges]);

    const totalAmount = useMemo(() => {
        const size = Number(formData.size) || 0;
        return newMarlaRate * size;
    }, [newMarlaRate, formData.size]);

    // ---------- Installment plan calculation ----------
    const frequencyMeta =
        FREQUENCY_OPTIONS.find(f => f.value === formData.installmentFrequency) ?? FREQUENCY_OPTIONS[0];

    const remainingAmount = useMemo(() => {
        const down = Number(formData.downPayment) || 0;
        return Math.max(totalAmount - down, 0);
    }, [totalAmount, formData.downPayment]);

    // installments per year depends on frequency, so translate planYears -> count of installments
    const totalInstallments = useMemo(() => {
        const years = Number(formData.planYears) || 0;
        const perYear = 12 / frequencyMeta.intervalMonths;
        return Math.max(Math.round(years * perYear), 0);
    }, [formData.planYears, frequencyMeta]);

    const installmentAmount = useMemo(() => {
        if (totalInstallments <= 0) return 0;
        return remainingAmount / totalInstallments;
    }, [remainingAmount, totalInstallments]);

    const paidInstallments = initialData.installmentPlan?.paidInstallments ?? 0;

    const pendingInstallments = useMemo(
        () => Math.max(totalInstallments - paidInstallments, 0),
        [totalInstallments, paidInstallments]
    );

    const nextDue = useMemo(() => {
        if (paidInstallments >= totalInstallments || totalInstallments <= 0) return undefined;

        const nextIndex = paidInstallments + 1; // 1-based
        const isLast = nextIndex === totalInstallments;
        const amount = isLast
            ? Math.round(remainingAmount - installmentAmount * (totalInstallments - 1))
            : Math.round(installmentAmount);

        const date = addMonthsISO(formData.planStartDate, frequencyMeta.intervalMonths * nextIndex);
        if (!date) return undefined; // planStartDate is empty/invalid — skip until fixed

        return { date, amount };
    }, [paidInstallments, totalInstallments, remainingAmount, installmentAmount, formData.planStartDate, frequencyMeta]);

    // ---------- Submit ----------
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...formData,
            price: totalAmount,
            totalAmount,
            pendingAmount: Math.max(totalAmount - formData.totalPaid, 0),
            installmentPlan: {
                totalInstallments,
                paidInstallments,
                pendingInstallments,
                installmentAmount,
                // nextDueDate: nextDue?.date,
                nextDueAmount: nextDue?.amount,
            },
        });
    };

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-PK', {
            style: 'currency',
            currency: 'PKR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);

    const cornerPct = formData.isCorner ? Number(formData.cornerCharges) || 0 : 0;
    const parkPct = formData.isParkFace ? Number(formData.parkFaceCharges) || 0 : 0;
    const totalPremiumPercent = cornerPct + parkPct;
    const hasPremium = totalPremiumPercent > 0;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Property Details - read only */}
            <div className="border-b border-border pb-6.5">
                <h3 className="text-md font-semibold text-foreground dark:text-white mb-4">
                    Property Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ReadOnlyField label="Property Number" value={formData.number} />
                    <ReadOnlyField label="Size (Marla)" value={formData.size} />
                    <ReadOnlyField label="Block" value={formData.block} />
                    <ReadOnlyField label="Street" value={formData.street} />
                </div>
            </div>

            {/* Pricing */}
            <div className="border-b border-border pb-6.5">
                <h3 className="text-md font-semibold text-foreground dark:text-white mb-4">
                    Pricing Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <TextField
                            label="Rate per Marla (PKR)"
                            name="ratePerMarla"
                            value={formData.ratePerMarla.toString()}
                            onChange={handleTextChange}
                            type="number"
                            required
                        />
                        {hasPremium && (
                            <div className="mt-2 flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-medium text-foreground dark:text-white">
                                    New Marla Rate:
                                </span>
                                <span className="text-sm font-bold text-success">
                                    {formatCurrency(newMarlaRate)}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    (+{totalPremiumPercent}%)
                                </span>
                            </div>
                        )}
                    </div>
                    <ReadOnlyField label="Total Amount (Calculated)" value={formatCurrency(totalAmount)} />
                </div>
            </div>

            {/* Installment Plan */}
            <div className="border-b border-border pb-6.5">
                <h3 className="text-md font-semibold text-foreground dark:text-white mb-4">
                    Installment Plan
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                        label="Down Payment (PKR)"
                        name="downPayment"
                        value={formData.downPayment.toString()}
                        onChange={handleTextChange}
                        type="number"
                        placeholder="0"
                        helperText="Optional. Deducted before splitting into installments."
                    />
                    <Select
                        label='Installment Frequency'
                        name="installmentFrequency"
                        value={formData.installmentFrequency}
                        onChange={handleFrequencyChange}
                        options={FREQUENCY_OPTIONS}
                    />

                    <TextField
                        label="Plan Duration (Years)"
                        name="planYears"
                        value={formData.planYears.toString()}
                        onChange={handleTextChange}
                        type="number"
                        placeholder="1"
                    />
                    <TextField
                        label="Plan Start Date"
                        name="planStartDate"
                        value={formData.planStartDate}
                        onChange={handleTextChange}
                        type="date"
                    />
                </div>

                {totalInstallments > 0 && (
                    <div className="mt-3 space-y-1 text-sm">
                        <div className="flex flex-wrap items-center gap-4">
                            <span className="text-foreground dark:text-white">
                                <span className="font-medium">{totalInstallments}</span> installments of{' '}
                                <span className="font-bold text-success">{formatCurrency(installmentAmount)}</span>
                            </span>
                            <span className="text-xs text-muted-foreground">
                                {paidInstallments} paid · {pendingInstallments} pending
                            </span>
                        </div>
                        {nextDue && (
                            <div className="text-xs text-muted-foreground">
                                Next due: {nextDue.date} — {formatCurrency(nextDue.amount)}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Premium Features */}
            <div className="border-b border-border pb-6.5">
                <h3 className="text-md font-semibold text-foreground dark:text-white mb-4">
                    Premium Features
                </h3>
                <div className="space-y-4">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isCorner"
                                checked={formData.isCorner}
                                disabled
                                className="w-4 h-4 text-primary border-border rounded opacity-60 cursor-not-allowed"
                            />
                            <label htmlFor="isCorner" className="text-sm font-medium text-foreground dark:text-white">
                                Corner Property
                            </label>
                        </div>
                        {formData.isCorner && (
                            <div className="ml-6 max-w-xs">
                                <TextField
                                    label="Corner Premium (%)"
                                    name="cornerCharges"
                                    value={formData.cornerCharges.toString()}
                                    onChange={handleTextChange}
                                    type="number"
                                    placeholder="0"
                                    helperText="Additional percentage for corner property"
                                />
                            </div>
                        )}
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isParkFace"
                                checked={formData.isParkFace}
                                disabled
                                className="w-4 h-4 text-primary border-border rounded opacity-60 cursor-not-allowed"
                            />
                            <label htmlFor="isParkFace" className="text-sm font-medium text-foreground dark:text-white">
                                Park Face Property
                            </label>
                        </div>
                        {formData.isParkFace && (
                            <div className="ml-6 max-w-xs">
                                <TextField
                                    label="Park Face Premium (%)"
                                    name="parkFaceCharges"
                                    value={formData.parkFaceCharges.toString()}
                                    onChange={handleTextChange}
                                    type="number"
                                    placeholder="0"
                                    helperText="Additional percentage for park-facing property"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 ">
                <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
                    Cancel
                </Button>
                <Button type="submit" loading={isLoading} className="flex-1">
                    <Save size={18} className="mr-2" />
                    Save Changes
                </Button>
            </div>
        </form>
    );
};