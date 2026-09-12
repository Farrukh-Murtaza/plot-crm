export const PAYMENT_TYPES = [
    { value: 'installment', label: 'Installment' },
    { value: 'booking', label: 'Booking Fee' },
    { value: 'full_payment', label: 'Full Payment' },
    { value: 'penalty', label: 'Penalty' },
    { value: 'other', label: 'Other' },
] as const;

export const PAYMENT_METHODS = [
    { value: 'cash', label: 'Cash' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'cheque', label: 'Cheque' },
    { value: 'online', label: 'Online' },
] as const;

export type PaymentType = (typeof PAYMENT_TYPES)[number]['value'];
export type PaymentMethod = (typeof PAYMENT_METHODS)[number]['value'];