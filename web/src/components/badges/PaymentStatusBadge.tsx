import type { PaymentStatus } from '../../types';

interface PaymentStatusBadgeProps {
    status: PaymentStatus;
    size?: 'sm' | 'md';
}

const CONFIG: Record<PaymentStatus, { label: string; className: string }> = {
    paid: { label: 'Paid', className: 'bg-success/10 text-success' },
    pending: { label: 'Pending', className: 'bg-warning/10 text-warning' },
    overdue: { label: 'Overdue', className: 'bg-danger/10 text-danger' },
};

export const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({
    status,
    size = 'md',
}) => {
    const config = CONFIG[status];
    const sizeClasses = size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs';

    return (
        <span
            className={`inline-flex items-center whitespace-nowrap shrink-0 rounded-full font-medium ${sizeClasses} ${config.className}`}
        >
            {config.label}
        </span>
    );
};