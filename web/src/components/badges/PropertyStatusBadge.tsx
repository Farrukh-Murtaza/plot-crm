import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import type { PropertyStatus } from '../../types';

interface PropertyStatusBadgeProps {
    status: PropertyStatus;
    size?: 'sm' | 'md';
}

const CONFIG: Record<
    PropertyStatus,
    { label: string; icon: typeof CheckCircle; className: string }
> = {
    available: {
        label: 'Available',
        icon: CheckCircle,
        className: 'bg-success/10 text-success border-success/20',
    },
    sold: {
        label: 'Sold',
        icon: XCircle,
        className: 'bg-neutral-500/10 text-neutral-500 border-neutral-500/20',
    },
    reserved: {
        label: 'Reserved',
        icon: Clock,
        className: 'bg-warning/10 text-warning border-warning/20',
    },
    pending: {
        label: 'Pending Payment',
        icon: AlertCircle,
        className: 'bg-danger/10 text-danger border-danger/20',
    },
};

export const PropertyStatusBadge: React.FC<PropertyStatusBadgeProps> = ({
    status,
    size = 'md',
}) => {
    const config = CONFIG[status];
    const Icon = config.icon;

    const sizeClasses =
        size === 'sm'
            ? 'px-2 py-0.5 text-[10px] gap-1'
            : 'px-3 py-1 text-xs gap-1.5';

    const iconSize = size === 'sm' ? 10 : 12;

    return (
        <span
            className={`inline-flex items-center rounded-full font-medium border ${sizeClasses} ${config.className}`}
        >
            <Icon size={iconSize} />
            {config.label}
        </span>
    );
};