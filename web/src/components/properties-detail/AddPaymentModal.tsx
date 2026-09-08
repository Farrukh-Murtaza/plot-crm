import React, { useState } from 'react';
import { X, Plus, DollarSign } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface PaymentData {
    date: string;
    description: string;
    amount: number;
    type: 'installment' | 'booking' | 'full_payment' | 'penalty' | 'other';
    method: 'cash' | 'bank_transfer' | 'cheque' | 'online';
    notes?: string;
}

interface AddPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: PaymentData) => void;
}

export const AddPaymentModal: React.FC<AddPaymentModalProps> = ({
    isOpen,
    onClose,
    onSave
}) => {
    const [formData, setFormData] = useState<PaymentData>({
        date: new Date().toISOString().split('T')[0],
        description: '',
        amount: 0,
        type: 'installment',
        method: 'cash',
        notes: ''
    });
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            onSave(formData);
            onClose();
        } catch (error) {
            console.error('Error adding payment:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'amount' ? parseFloat(value) : value
        }));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <Card className="w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted transition-colors"
                >
                    <X size={20} className="text-muted-foreground" />
                </button>

                <h2 className="text-2xl font-bold text-foreground dark:text-white mb-6 flex items-center gap-2">
                    <DollarSign size={24} className="text-primary" />
                    Add Payment
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground dark:text-white mb-1">
                            Date *
                        </label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-surface dark:bg-surface-elevated border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground dark:text-white mb-1">
                            Description *
                        </label>
                        <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="e.g., 3rd Installment"
                            className="w-full px-3 py-2 bg-surface dark:bg-surface-elevated border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground dark:text-white mb-1">
                            Amount (PKR) *
                        </label>
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount || ''}
                            onChange={handleChange}
                            placeholder="0"
                            className="w-full px-3 py-2 bg-surface dark:bg-surface-elevated border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground dark:text-white mb-1">
                                Payment Type
                            </label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-surface dark:bg-surface-elevated border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                            >
                                <option value="installment">Installment</option>
                                <option value="booking">Booking Fee</option>
                                <option value="full_payment">Full Payment</option>
                                <option value="penalty">Penalty</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground dark:text-white mb-1">
                                Payment Method
                            </label>
                            <select
                                name="method"
                                value={formData.method}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-surface dark:bg-surface-elevated border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                            >
                                <option value="cash">Cash</option>
                                <option value="bank_transfer">Bank Transfer</option>
                                <option value="cheque">Cheque</option>
                                <option value="online">Online</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground dark:text-white mb-1">
                            Notes (Optional)
                        </label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows={2}
                            placeholder="Additional notes about this payment..."
                            className="w-full px-3 py-2 bg-surface dark:bg-surface-elevated border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                        />
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-border">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            loading={loading}
                            className="flex-1"
                        >
                            <Plus size={18} className="mr-2" />
                            Add Payment
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};