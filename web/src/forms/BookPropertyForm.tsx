import React, { useMemo, useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { TextField } from '../components/ui/TextField';
import { Select } from '../components/ui/Select';
import { TITLES, RELATIONS, OCCUPATIONS } from '../constants/contact';
import type { Property, OwnerDetail } from '../types';

type InstallmentFrequency = 'monthly' | 'quarterly' | 'semiannual' | 'yearly';

const FREQUENCY_OPTIONS = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Every 3 Months' },
    { value: 'semiannual', label: 'Every 6 Months' },
    { value: 'yearly', label: 'Yearly' },
] as const;

const FREQUENCY_MONTHS: Record<InstallmentFrequency, number> = {
    monthly: 1,
    quarterly: 3,
    semiannual: 6,
    yearly: 12,
};

const toOption = (v: string) => ({ value: v, label: v });

const addMonthsISO = (iso: string, months: number): string | null => {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return null;
    d.setMonth(d.getMonth() + months);
    return d.toISOString().slice(0, 10);
};

export interface BookPropertyFormData {
    owner: OwnerDetail;
    downPayment: number;
    installmentFrequency: InstallmentFrequency;
    planYears: number;
    planStartDate: string;
}

interface BookPropertyFormProps {
    property: Property;
    onBook: (data: BookPropertyFormData) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export const BookPropertyForm: React.FC<BookPropertyFormProps> = ({
    property,
    onBook,
    onCancel,
    isLoading = false,
}) => {
    const [owner, setOwner] = useState<OwnerDetail>({
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
    });

    const [downPayment, setDownPayment] = useState(0);
    const [installmentFrequency, setInstallmentFrequency] = useState<InstallmentFrequency>('monthly');
    const [planYears, setPlanYears] = useState(1);
    const [planStartDate, setPlanStartDate] = useState(new Date().toISOString().slice(0, 10));
    const [error, setError] = useState<string | null>(null);

    const handleOwnerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setOwner(prev => ({ ...prev, [name]: value }));
    };

    const remaining = Math.max(property.price - (downPayment || 0), 0);
    const totalInstallments = useMemo(
        () => Math.max(Math.round((planYears || 0) * (12 / FREQUENCY_MONTHS[installmentFrequency])), 0),
        [planYears, installmentFrequency]
    );
    const installmentAmount = totalInstallments > 0 ? remaining / totalInstallments : 0;
    const firstDueDate = totalInstallments > 0
        ? addMonthsISO(planStartDate, FREQUENCY_MONTHS[installmentFrequency])
        : null;

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-PK', {
            style: 'currency',
            currency: 'PKR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!owner.name.trim() || !owner.phone.trim()) {
            setError('Owner name and phone are required.');
            return;
        }
        if (downPayment < 0 || downPayment > property.price) {
            setError('Down payment must be between 0 and the total price.');
            return;
        }
        if (!planStartDate) {
            setError('Plan start date is required.');
            return;
        }

        setError(null);
        onBook({ owner, downPayment, installmentFrequency, planYears, planStartDate });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-3 bg-muted rounded-lg text-sm">
                Booking <span className="font-semibold">Property #{property.number}</span> — {formatCurrency(property.price)} total
            </div>

            {/* Owner details */}
            <div>
                <h3 className="text-sm font-semibold text-foreground dark:text-white mb-3">Buyer Details</h3>
                <div className="grid grid-cols-2 gap-3">
                    <Select label="Title" name="title" value={owner.title} onChange={handleOwnerChange} options={TITLES.map(toOption)} />
                    <TextField label="Full Name" name="name" type="text" value={owner.name} onChange={handleOwnerChange} required />
                    <Select label="Relation" name="relation" value={owner.relation} onChange={handleOwnerChange} options={RELATIONS.map(toOption)} />
                    <TextField label="Relative's Name" name="relativeName" type="text" value={owner.relationName} onChange={handleOwnerChange} />
                    <Select label="Occupation" name="occupation" value={owner.occupation} onChange={handleOwnerChange} options={OCCUPATIONS.map(toOption)} />
                    <TextField label="CNIC" name="cnic" type="text" value={owner.cnic} onChange={handleOwnerChange} placeholder="XXXXX-XXXXXXX-X" />
                    <TextField label="Phone" name="phone" type="text" value={owner.phone} onChange={handleOwnerChange} required />
                    <TextField label="Email" name="email" type="email" value={owner.email} onChange={handleOwnerChange} />
                </div>
                <div className="mt-3">
                    <TextField label="Address" name="address" type="text" value={owner.address} onChange={handleOwnerChange} />
                </div>
            </div>

            {/* Payment plan */}
            <div>
                <h3 className="text-sm font-semibold text-foreground dark:text-white mb-3">Payment Plan</h3>
                <div className="grid grid-cols-2 gap-3">
                    <TextField
                        label="Down Payment (PKR)"
                        name="downPayment"
                        type="number"
                        value={downPayment || ''}
                        onChange={(e) => setDownPayment(parseFloat(e.target.value) || 0)}
                        placeholder="0"
                    />
                    <Select
                        label="Installment Frequency"
                        name="installmentFrequency"
                        value={installmentFrequency}
                        onChange={(e) => setInstallmentFrequency(e.target.value as InstallmentFrequency)}
                        options={FREQUENCY_OPTIONS}
                    />
                    <TextField
                        label="Plan Duration (Years)"
                        name="planYears"
                        type="number"
                        value={planYears || ''}
                        onChange={(e) => setPlanYears(parseFloat(e.target.value) || 0)}
                        placeholder="1"
                    />
                    <TextField
                        label="Plan Start Date"
                        name="planStartDate"
                        type="date"
                        value={planStartDate}
                        onChange={(e) => setPlanStartDate(e.target.value)}
                        required
                    />
                </div>

                {totalInstallments > 0 && (
                    <div className="mt-3 p-3 bg-success/5 border border-success/10 rounded-lg text-sm space-y-1">
                        <p>
                            <span className="font-medium">{totalInstallments}</span> installments of{' '}
                            <span className="font-bold text-success">{formatCurrency(installmentAmount)}</span>
                        </p>
                        {firstDueDate && (
                            <p className="text-xs text-muted-foreground">First installment due: {firstDueDate}</p>
                        )}
                    </div>
                )}

                {error && <p className="mt-2 text-xs text-danger">{error}</p>}
            </div>

            <div className="flex gap-3 pt-4 border-t border-border">
                <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
                    Cancel
                </Button>
                <Button type="submit" loading={isLoading} className="flex-1">
                    <CheckCircle size={18} className="mr-2" />
                    Confirm Booking
                </Button>
            </div>
        </form>
    );
};