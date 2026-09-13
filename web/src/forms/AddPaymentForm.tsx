import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import type { AddPaymentFormData } from '../types';
import { Select, Textarea, TextField } from '../components/ui';
import { PAYMENT_TYPES, PAYMENT_METHODS } from '../constants/payment';

interface AddPaymentFormProps {
    onSave: (data: AddPaymentFormData) => void;
    onCancel: () => void;
    isLoading?: boolean;
}


const emptyForm: AddPaymentFormData = {
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: 0,
    type: 'installment',
    method: 'cash',
    notes: '',
};

export const AddPaymentForm: React.FC<AddPaymentFormProps> = ({
    onSave,
    onCancel,
    isLoading = false,
}) => {
    const [formData, setFormData] = useState<AddPaymentFormData>(emptyForm);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        if (name === 'amount') {
            const n = parseFloat(value);
            setFormData(prev => ({ ...prev, amount: isNaN(n) ? 0 : n }));
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.amount <= 0) {
            setError('Amount must be greater than 0.');
            return;
        }

        setError(null);
        onSave({ ...formData, description: formData.description.trim(), notes: formData.notes?.trim() });
    };


    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <TextField
                label="Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
            />

            <TextField
                label="Description"
                name="description"
                type="text"
                value={formData.description}
                onChange={handleChange}
                placeholder="e.g., 3rd Installment"
                required
            />

            <div>
                <TextField
                    label="Amount (PKR)"
                    name="amount"
                    type="number"
                    value={formData.amount || ''}
                    onChange={handleChange}
                    placeholder="0"
                    required
                />
                {error && <p className="mt-1 text-xs text-danger">{error}</p>}
            </div>


            <div className="grid grid-cols-2 gap-4">
                <Select
                    label="Payment Type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    options={PAYMENT_TYPES}
                />
                <Select
                    label="Payment Method"
                    name="method"
                    value={formData.method}
                    onChange={handleChange}
                    options={PAYMENT_METHODS}
                />
            </div>

            <Textarea
                label="Notes (Optional)"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Additional notes about this payment..."
            />

            <div className="flex gap-3 ">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                    className="flex-1"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    loading={isLoading}
                    className="flex-1"
                >
                    <Plus size={18} className="mr-2" />
                    Add Payment
                </Button>
            </div>
        </form>
    );
};