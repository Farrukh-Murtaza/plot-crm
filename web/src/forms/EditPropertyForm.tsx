import React, { useState, useMemo } from 'react';
import { Save, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { TextField } from '../components/ui/TextField';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { PhoneTextField } from '../components/ui/PhoneTextField';
import { CNICTextField } from '../components/ui/CNICTextField';
import { TITLES, RELATIONS, OCCUPATIONS } from '../constants/contact';
import { addMonthsISO, FREQUENCY_MONTHS, type InstallmentFrequency } from '../utils/installments';
import type { PropertyData, OwnerDetail } from '../types';

const FREQUENCY_OPTIONS = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Every 3 Months' },
    { value: 'semiannual', label: 'Every 6 Months' },
    { value: 'yearly', label: 'Yearly' },
] as const;

const toOption = (v: string) => ({ value: v, label: v });

const emptyOwner: OwnerDetail = {
    title: 'Mr.',
    name: '',
    relation: 'S/O',
    relationName: '',
    cnic: '',
    phone: '',
    whatsapp: '',
    email: '',
    occupation: 'Business Owner',
    address: '',
    nominee: null,
};

interface EditPropertyFormProps {
    initialData: PropertyData;
    onSave: (data: PropertyData) => void;
    onCancel: () => void;
    isLoading?: boolean;
    /** 'edit' = update an already-booked property. 'book' = first-time booking, adds the Buyer + Nominee step. */
    mode?: 'edit' | 'book';
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

const StepIndicator: React.FC<{ steps: string[]; current: number }> = ({ steps, current }) => (
    <div className="flex items-center gap-2 mb-6">
        {steps.map((label, i) => (
            <React.Fragment key={label}>
                <div className="flex items-center gap-2">
                    <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0
                            ${i < current ? 'bg-success text-white'
                                : i === current ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-muted-foreground'}`}
                    >
                        {i < current ? '✓' : i + 1}
                    </div>
                    <span className={`text-sm hidden sm:inline ${i === current ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                        {label}
                    </span>
                </div>
                {i < steps.length - 1 && <div className="flex-1 h-px bg-border" />}
            </React.Fragment>
        ))}
    </div>
);

export const EditPropertyForm: React.FC<EditPropertyFormProps> = ({
    initialData,
    onSave,
    onCancel,
    isLoading = false,
    mode = 'edit',
}) => {
    const isBooking = mode === 'book';

    const steps = isBooking
        ? ['Buyer Details', 'Pricing & Features', 'Installment Plan']
        : ['Pricing & Features', 'Installment Plan'];

    const [step, setStep] = useState(0);
    const isFirstStep = step === 0;
    const isLastStep = step === steps.length - 1;

    const [formData, setFormData] = useState<PropertyData & { owner: OwnerDetail }>(() => ({
        ...initialData,
        isParkFace: Boolean(initialData.isParkFace),
        parkFaceCharges: Number(initialData.parkFaceCharges) || 0,
        isCorner: Boolean(initialData.isCorner),
        cornerCharges: Number(initialData.cornerCharges) || 0,
        owner: initialData.owner ?? emptyOwner,
        downPayment: Number(initialData.downPayment) || 0,
        installmentFrequency: initialData.installmentFrequency ?? 'monthly',
        planYears: Number(initialData.planYears) || 1,
        planStartDate: initialData.planStartDate || new Date().toISOString().slice(0, 10),
    }));

    const owner = formData.owner;
    const [error, setError] = useState<string | null>(null);

    // ---------- Property field handlers ----------
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

    // ---------- Owner field handlers ----------
    const handleOwnerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const field = name as keyof OwnerDetail;

        setFormData(prev => ({
            ...prev,
            owner: {
                ...prev.owner,
                [field]: value as OwnerDetail[typeof field],
            },
        }));
    };

    const handleOwnerAddressChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, owner: { ...prev.owner, address: e.target.value } }));
    };

    const handleWhatsappSameAsPhone = (e: React.ChangeEvent<HTMLInputElement>) => {
        const same = e.target.checked;
        setFormData(prev => ({
            ...prev,
            owner: { ...prev.owner, whatsapp: same ? prev.owner.phone : '' },
        }));
    };

    // ---------- Nominee field handler ----------
    const handleNomineeChange = <K extends keyof NonNullable<OwnerDetail['nominee']>>(
        field: K,
        value: string,
    ) => {
        setFormData(prev => ({
            ...prev,
            owner: {
                ...prev.owner,
                nominee: {
                    ...(prev.owner.nominee ?? { name: '', title: 'Mr.', relation: 'S/O', cnic: '', phone: '' }),
                    [field]: value as NonNullable<OwnerDetail['nominee']>[K],
                },
            },
        }));
    };

    // ---------- Pricing calculation ----------
    const newMarlaRate = useMemo(() => {
        const rate = Number(formData.ratePerMarla) || 0;
        const cornerPct = formData.isCorner ? (Number(formData.cornerCharges) || 0) : 0;
        const parkPct = formData.isParkFace ? (Number(formData.parkFaceCharges) || 0) : 0;
        return rate + rate * (cornerPct / 100) + rate * (parkPct / 100);
    }, [formData.ratePerMarla, formData.isCorner, formData.cornerCharges, formData.isParkFace, formData.parkFaceCharges]);

    const totalAmount = useMemo(() => (Number(formData.size) || 0) * newMarlaRate, [newMarlaRate, formData.size]);

    // ---------- Installment plan calculation ----------
    const frequencyMonths = FREQUENCY_MONTHS[formData.installmentFrequency];

    const remainingAmount = useMemo(
        () => Math.max(totalAmount - (Number(formData.downPayment) || 0), 0),
        [totalAmount, formData.downPayment]
    );

    const totalInstallments = useMemo(
        () => Math.max(Math.round((Number(formData.planYears) || 0) * (12 / frequencyMonths)), 0),
        [formData.planYears, frequencyMonths]
    );

    const installmentAmount = totalInstallments > 0 ? remainingAmount / totalInstallments : 0;

    const paidInstallments = isBooking ? 0 : (initialData.installmentPlan?.paidInstallments ?? 0);

    const pendingInstallments = Math.max(totalInstallments - paidInstallments, 0);

    const nextDue = useMemo(() => {
        if (paidInstallments >= totalInstallments || totalInstallments <= 0) return undefined;
        const nextIndex = paidInstallments + 1;
        const isLast = nextIndex === totalInstallments;
        const amount = isLast
            ? Math.round(remainingAmount - installmentAmount * (totalInstallments - 1))
            : Math.round(installmentAmount);
        const date = addMonthsISO(formData.planStartDate, frequencyMonths * nextIndex);
        if (!date) return undefined;
        return { date, amount };
    }, [paidInstallments, totalInstallments, remainingAmount, installmentAmount, formData.planStartDate, frequencyMonths]);

    // ---------- Step navigation ----------
    const currentStepLabel = steps[step];

    const validateStep = (): string | null => {
        if (currentStepLabel === 'Buyer Details') {
            if (!formData.owner.name.trim() || !formData.owner.phone.trim()) {
                return 'Owner name and phone are required to continue.';
            }
        }
        if (currentStepLabel === 'Installment Plan') {
            if (!formData.planStartDate) return 'Plan start date is required.';
        }
        return null;
    };

    const handleNext = () => {
        const validationError = validateStep();
        if (validationError) {
            setError(validationError);
            return;
        }
        setError(null);
        setStep(prev => Math.min(prev + 1, steps.length - 1));
    };

    const handleBack = () => {
        setError(null);
        setStep(prev => Math.max(prev - 1, 0));
    };

    // ---------- Submit (only fires from the last step) ----------
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLastStep) return; // safety net; Next button is type="button" so this shouldn't trigger early

        const validationError = validateStep();
        if (validationError) {
            setError(validationError);
            return;
        }
        setError(null);

        const bookingPayment = isBooking && formData.downPayment > 0
            ? [{
                id: crypto.randomUUID(),
                date: new Date().toISOString().slice(0, 10),
                description: 'Booking / Down Payment',
                receiptNo: '',
                amount: formData.downPayment,
                type: 'booking' as const,
                status: 'paid' as const,
                method: 'cash' as const,
                notes: '',
            }]
            : [];

        onSave({
            ...formData,
            price: totalAmount,
            totalAmount,
            status: isBooking ? 'reserved' : formData.status,
            bookingDate: isBooking ? new Date().toISOString().slice(0, 10) : formData.bookingDate,
            totalPaid: isBooking ? formData.downPayment : formData.totalPaid,
            pendingAmount: Math.max(totalAmount - (isBooking ? formData.downPayment : formData.totalPaid), 0),
            payments: isBooking ? [...formData.payments, ...bookingPayment] : formData.payments,
            installmentPlan: {
                totalInstallments,
                paidInstallments,
                pendingInstallments,
                installmentAmount,
                nextDueDate: nextDue?.date,
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
            {/* Property summary - pinned context on every step */}
            <div className="grid grid-cols-4 gap-2 p-3 bg-muted rounded-lg text-sm">
                <div><span className="text-muted-foreground">Number:</span> <span className="font-medium">{formData.number}</span></div>
                <div><span className="text-muted-foreground">Size:</span> <span className="font-medium">{formData.size} Marla</span></div>
                <div><span className="text-muted-foreground">Block:</span> <span className="font-medium">{formData.block}</span></div>
                <div><span className="text-muted-foreground">Street:</span> <span className="font-medium">{formData.street}</span></div>
            </div>

            <StepIndicator steps={steps} current={step} />

            {/* ---------------- Step: Buyer Details (booking only) ---------------- */}
            {currentStepLabel === 'Buyer Details' && (
                <div>
                    <h3 className="text-sm font-semibold text-foreground dark:text-white mb-4">Buyer Details</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <Select
                            label="Title"
                            name="title"
                            value={formData.owner.title}
                            onChange={handleOwnerChange}
                            options={TITLES.map(toOption)}
                        />
                        <TextField
                            label="Full Name"
                            name="name"
                            type="text"
                            value={formData.owner.name}
                            onChange={handleOwnerChange}
                            required
                        />
                        <Select
                            label="Relation"
                            name="relation"
                            value={formData.owner.relation}
                            onChange={handleOwnerChange}
                            options={RELATIONS.map(toOption)}
                        />
                        <TextField
                            label="Relative's Name"
                            name="relationName"
                            type="text"
                            value={formData.owner.relationName ?? ''}
                            onChange={handleOwnerChange}
                        />
                        <Select
                            label="Occupation"
                            name="occupation"
                            value={formData.owner.occupation}
                            onChange={handleOwnerChange}
                            options={OCCUPATIONS.map(toOption)}
                        />
                        <CNICTextField
                            name="cnic"
                            label="CNIC"
                            value={formData.owner.cnic}
                            onChange={handleOwnerChange}
                        />
                        <PhoneTextField
                            name="phone"
                            label="Phone"
                            value={formData.owner.phone}
                            onChange={handleOwnerChange}
                        />
                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.owner.email}
                            onChange={handleOwnerChange}
                        />
                    </div>

                    {/* WhatsApp with "same as phone" */}
                    <div className="mt-3">
                        <div className="flex items-center gap-2 mb-2">
                            <input
                                type="checkbox"
                                id="whatsappSameAsPhone"
                                checked={formData.owner.whatsapp === formData.owner.phone && formData.owner.phone !== ''}
                                onChange={handleWhatsappSameAsPhone}
                                className="w-4 h-4 text-primary border-border rounded"
                            />
                            <label htmlFor="whatsappSameAsPhone" className="text-sm text-foreground dark:text-white">
                                WhatsApp same as phone
                            </label>
                        </div>
                        {formData.owner.whatsapp !== formData.owner.phone && (
                            <PhoneTextField
                                name="whatsapp"
                                label="WhatsApp"
                                value={formData.owner.whatsapp}
                                onChange={handleOwnerChange}
                            />
                        )}
                    </div>

                    {/* Address */}
                    <div className="mt-3">
                        <Textarea
                            label="Address"
                            name="address"
                            value={formData.owner.address}
                            onChange={handleOwnerAddressChange}
                            rows={2}
                        />
                    </div>

                    {/* Nominee */}
                    <div className="mt-6">
                        <h4 className="text-sm font-semibold text-foreground dark:text-white mb-3">Nominee Details</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <Select
                                label="Title"
                                name="title"
                                value={formData.owner.nominee?.title ?? 'Mr.'}
                                onChange={(e) => handleNomineeChange('title', e.target.value)}
                                options={TITLES.map(toOption)}
                            />
                            <TextField
                                label="Nominee Name"
                                name="nomineeName"
                                type="text"
                                value={formData.owner.nominee?.name ?? ''}
                                onChange={(e) => handleNomineeChange('name', e.target.value)}
                            />
                            <Select
                                label="Relation"
                                name="relation"
                                value={formData.owner.nominee?.relation ?? 'S/O'}
                                onChange={(e) => handleNomineeChange('relation', e.target.value)}
                                options={RELATIONS.map(toOption)}
                            />
                            <CNICTextField
                                name="nomineeCnic"
                                label="Nominee CNIC"
                                value={formData.owner.nominee?.cnic ?? ''}
                                onChange={(e) => handleNomineeChange('cnic', e.target.value)}
                            />
                            <PhoneTextField
                                name="nomineePhone"
                                label="Nominee Phone"
                                value={formData.owner.nominee?.phone ?? ''}
                                onChange={(e) => handleNomineeChange('phone', e.target.value)}
                            />
                            <TextField
                                label="Nominee Email"
                                name="nomineeEmail"
                                type="email"
                                value={formData.owner.nominee?.email ?? ''}
                                onChange={(e) => handleNomineeChange('email', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* ---------------- Step: Pricing & Features ---------------- */}
            {currentStepLabel === 'Pricing & Features' && (
                <div className="space-y-6">
                    <div>
                        <h3 className="text-sm font-semibold text-foreground dark:text-white mb-4">Pricing Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <TextField
                                    label="Rate per Marla (PKR)"
                                    name="ratePerMarla"
                                    value={formData.ratePerMarla}
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

                    <div>
                        <h3 className="text-sm font-semibold text-foreground dark:text-white mb-4">Premium Features</h3>
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
                </div>
            )}

            {/* ---------------- Step: Installment Plan ---------------- */}
            {currentStepLabel === 'Installment Plan' && (
                <div>
                    <h3 className="text-sm font-semibold text-foreground dark:text-white mb-4">Installment Plan</h3>
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
                            label="Installment Frequency"
                            name="installmentFrequency"
                            value={formData.installmentFrequency}
                            onChange={handleFrequencyChange}
                            options={FREQUENCY_OPTIONS}
                            placeholder=""
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
                            required
                        />
                    </div>

                    {totalInstallments > 0 && (
                        <div className="mt-3 space-y-1 text-sm">
                            <div className="flex flex-wrap items-center gap-4">
                                <span className="text-foreground dark:text-white">
                                    <span className="font-medium">{totalInstallments}</span> installments of{' '}
                                    <span className="font-bold text-success">{formatCurrency(installmentAmount)}</span>
                                </span>
                                {!isBooking && (
                                    <span className="text-xs text-muted-foreground">
                                        {paidInstallments} paid · {pendingInstallments} pending
                                    </span>
                                )}
                            </div>
                            {nextDue && (
                                <div className="text-xs text-muted-foreground">
                                    {isBooking ? 'First installment due' : 'Next due'}: {nextDue.date} — {formatCurrency(nextDue.amount)}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {error && <p className="text-sm text-danger">{error}</p>}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-border">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={isFirstStep ? onCancel : handleBack}
                    className="flex-1"
                >
                    {isFirstStep ? 'Cancel' : (<><ChevronLeft size={18} className="mr-1" />Back</>)}
                </Button>

                {isLastStep ? (
                    <Button type="submit" loading={isLoading} className="flex-1">
                        {isBooking ? <CheckCircle size={18} className="mr-2" /> : <Save size={18} className="mr-2" />}
                        {isBooking ? 'Confirm Booking' : 'Save Changes'}
                    </Button>
                ) : (
                    <Button type="button" onClick={handleNext} className="flex-1">
                        Next
                        <ChevronRight size={18} className="ml-1" />
                    </Button>
                )}
            </div>
        </form>
    );
};