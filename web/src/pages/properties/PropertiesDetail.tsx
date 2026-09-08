import React, { useState, useMemo } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
    ArrowLeft,
    Home,
    User,
    DollarSign,
    Calendar,
    Phone,
    Mail,
    MapPin,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Download,
    Printer,
    Edit,
    Plus,
    Sun,
    Moon,
    LogOut,
    CreditCard,
    Receipt,
    FileText,
    TrendingUp,
    Eye,
    ChevronDown,
    ChevronUp,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

// Import components
import { EditPlotModal } from '../../components/plot-detail/EditPlotModal';
import { EditOwnerModal } from '../../components/plot-detail/EditOwnerModal';
import { AddPaymentModal } from '../../components/plot-detail/AddPaymentModal';
import { AddNoteModal } from '../../components/plot-detail/AddNoteModal';
import { ViewDocumentModal } from '../../components/plot-detail/ViewDocumentModal';

// Types
interface Payment {
    id: string;
    date: string;
    description: string;
    receiptNo: string;
    amount: number;
    type: 'installment' | 'booking' | 'full_payment' | 'penalty' | 'other';
    status: 'paid' | 'pending' | 'overdue';
    method: 'cash' | 'bank_transfer' | 'cheque' | 'online';
    notes?: string;
}

interface Owner {
    id: string;
    name: string;
    phone: string;
    email: string;
    cnic: string;
    address: string;
    occupation?: string;
    joinDate: string;
}

interface Document {
    name: string;
    type: string;
    uploadedAt: string;
    url: string;
}

interface Note {
    id: string;
    content: string;
    createdAt: string;
    createdBy: string;
}

interface PlotData {
    id: string;
    number: string;
    size: number;
    block: string;
    street: string;
    sector: string;
    status: 'available' | 'sold' | 'reserved' | 'pending';
    price: number;
    ratePerMarla: number;
    totalAmount: number;
    parkFace: number;
    corner: boolean;
    dimensions: {
        width: number;
        length: number;
    };
    owner: Owner;
    payments: Payment[];
    bookingDate: string;
    possessionDate?: string;
    totalPaid: number;
    pendingAmount: number;
    installmentPlan: {
        totalInstallments: number;
        paidInstallments: number;
        pendingInstallments: number;
        nextDueDate?: string;
        nextDueAmount?: number;
    };
    documents: Document[];
    notes: Note[];
}

// Mock Data
const mockPlotDetail: PlotData = {
    id: '1',
    number: '12',
    size: 10,
    block: 'A',
    street: '2',
    sector: 'Royal Enclave',
    status: 'sold',
    price: 2500000,
    ratePerMarla: 250000,
    totalAmount: 2500000,
    parkFace: 10,
    corner: true,
    dimensions: {
        width: 30,
        length: 50
    },
    owner: {
        id: '1',
        name: 'Mr. Ahmad Khan',
        phone: '+92 300 1234567',
        email: 'ahmad.khan@example.com',
        cnic: '12345-6789012-3',
        address: 'House #123, Street #4, Phase 1, Royal Enclave, Okara',
        occupation: 'Business Owner',
        joinDate: '2024-01-15'
    },
    payments: [
        {
            id: 'p1',
            date: '2024-01-15',
            description: 'Booking Fee',
            receiptNo: 'R-2024-001',
            amount: 250000,
            type: 'booking',
            status: 'paid',
            method: 'cash',
            notes: 'Initial booking fee paid in cash'
        },
        {
            id: 'p2',
            date: '2024-02-01',
            description: '1st Installment',
            receiptNo: 'R-2024-015',
            amount: 250000,
            type: 'installment',
            status: 'paid',
            method: 'bank_transfer',
            notes: 'Transferred via HBL'
        },
        {
            id: 'p3',
            date: '2024-03-01',
            description: '2nd Installment',
            receiptNo: 'R-2024-032',
            amount: 250000,
            type: 'installment',
            status: 'paid',
            method: 'cheque',
            notes: 'Cheque #123456'
        },
        {
            id: 'p4',
            date: '2024-04-01',
            description: '3rd Installment',
            receiptNo: 'R-2024-048',
            amount: 250000,
            type: 'installment',
            status: 'pending',
            method: 'online',
            notes: 'Pending - Due date 2024-04-15'
        },
        {
            id: 'p5',
            date: '2024-05-01',
            description: '4th Installment',
            receiptNo: 'R-2024-063',
            amount: 250000,
            type: 'installment',
            status: 'overdue',
            method: 'bank_transfer',
            notes: 'Overdue - Payment not received'
        },
        {
            id: 'p6',
            date: '2024-06-01',
            description: '5th Installment',
            receiptNo: 'R-2024-078',
            amount: 250000,
            type: 'installment',
            status: 'pending',
            method: 'cash',
            notes: 'Pending'
        },
        {
            id: 'p7',
            date: '2024-01-20',
            description: 'Development Charges',
            receiptNo: 'R-2024-009',
            amount: 100000,
            type: 'other',
            status: 'paid',
            method: 'bank_transfer',
            notes: 'Development charges for plot'
        },
        {
            id: 'p8',
            date: '2024-02-15',
            description: 'Late Payment Penalty',
            receiptNo: 'R-2024-022',
            amount: 25000,
            type: 'penalty',
            status: 'paid',
            method: 'cash',
            notes: 'Penalty for late installment #2'
        }
    ],
    bookingDate: '2024-01-15',
    possessionDate: '2024-06-15',
    totalPaid: 1125000,
    pendingAmount: 1375000,
    installmentPlan: {
        totalInstallments: 10,
        paidInstallments: 3,
        pendingInstallments: 7,
        nextDueDate: '2024-07-01',
        nextDueAmount: 250000
    },
    documents: [
        {
            name: 'CNIC Copy',
            type: 'Identity',
            uploadedAt: '2024-01-15',
            url: '#'
        },
        {
            name: 'Booking Form',
            type: 'Application',
            uploadedAt: '2024-01-15',
            url: '#'
        },
        {
            name: 'Sale Agreement',
            type: 'Legal',
            uploadedAt: '2024-02-01',
            url: '#'
        },
        {
            name: 'Payment Receipt #R-2024-001',
            type: 'Receipt',
            uploadedAt: '2024-01-15',
            url: '#'
        }
    ],
    notes: [
        {
            id: 'n1',
            content: 'Customer visited site with family. Very interested in corner plot.',
            createdAt: '2024-01-10 14:30',
            createdBy: 'Admin'
        },
        {
            id: 'n2',
            content: 'Booking fee paid. Agreement signed.',
            createdAt: '2024-01-15 11:00',
            createdBy: 'Admin'
        },
        {
            id: 'n3',
            content: 'Requested to extend installment deadline by 15 days.',
            createdAt: '2024-03-20 09:15',
            createdBy: 'Sales Team'
        }
    ]
};

// Status Badge Component
const StatusBadge: React.FC<{ status: PlotData['status'] }> = ({ status }) => {
    const configs = {
        available: { label: 'Available', icon: CheckCircle, className: 'bg-success/10 text-success border-success/20' },
        sold: { label: 'Sold', icon: XCircle, className: 'bg-neutral-500/10 text-neutral-500 border-neutral-500/20' },
        reserved: { label: 'Reserved', icon: Clock, className: 'bg-warning/10 text-warning border-warning/20' },
        pending: { label: 'Pending Payment', icon: AlertCircle, className: 'bg-danger/10 text-danger border-danger/20' }
    };
    const config = configs[status];
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${config.className}`}>
            <Icon size={12} />
            {config.label}
        </span>
    );
};

// Payment Status Badge Component
const PaymentStatusBadge: React.FC<{ status: Payment['status'] }> = ({ status }) => {
    const configs = {
        paid: { label: 'Paid', className: 'bg-success/10 text-success' },
        pending: { label: 'Pending', className: 'bg-warning/10 text-warning' },
        overdue: { label: 'Overdue', className: 'bg-danger/10 text-danger' }
    };
    const config = configs[status];

    return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
            {config.label}
        </span>
    );
};

// Helper component
const Briefcase: React.FC<{ size?: number; className?: string }> = ({ size = 16, className = '' }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

// Types for modal handlers
interface EditPlotData {
    number: string;
    size: number;
    block: string;
    street: string;
    sector: string;
    price: number;
    ratePerMarla: number;
    parkFace: number;
    corner: boolean;
}

interface EditOwnerData {
    name: string;
    phone: string;
    email: string;
    cnic: string;
    address: string;
    occupation?: string;
}

interface PaymentData {
    date: string;
    description: string;
    amount: number;
    type: 'installment' | 'booking' | 'full_payment' | 'penalty' | 'other';
    method: 'cash' | 'bank_transfer' | 'cheque' | 'online';
    notes?: string;
}

// Main Component
const PropertiesDetail: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // State for UI
    const [showAllPayments, setShowAllPayments] = useState(false);
    const [showAllNotes, setShowAllNotes] = useState(false);
    const [showAllDocs, setShowAllDocs] = useState(false);
    const [paymentFilter, setPaymentFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');

    // Modal states
    const [isEditPlotModalOpen, setIsEditPlotModalOpen] = useState(false);
    const [isEditOwnerModalOpen, setIsEditOwnerModalOpen] = useState(false);
    const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);
    const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

    // Get plot data
    const { id } = useParams<{ id: string }>();
    const plotId = id || location.state?.plotId || '1';
    const plot = mockPlotDetail; // In real app: fetch by plotId

    // Handlers for actions with proper types
    const handleEditPlot = (data: EditPlotData) => {
        console.log('Plot updated:', data);
        // In real app: API call to update plot
    };

    const handleEditOwner = (data: EditOwnerData) => {
        console.log('Owner updated:', data);
        // In real app: API call to update owner
    };

    const handleAddPayment = (data: PaymentData) => {
        console.log('Payment added:', data);
        // In real app: API call to add payment
    };

    const handleAddNote = (content: string) => {
        console.log('Note added:', content);
        // In real app: API call to add note
    };

    const handleViewDocument = (doc: Document) => {
        setSelectedDocument(doc);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    // Helper functions
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PK', {
            style: 'currency',
            currency: 'PKR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-PK', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    const getPaymentMethodIcon = (method: Payment['method']) => {
        switch (method) {
            case 'cash': return <DollarSign size={14} className="text-success" />;
            case 'bank_transfer': return <TrendingUp size={14} className="text-primary" />;
            case 'cheque': return <FileText size={14} className="text-warning" />;
            case 'online': return <CreditCard size={14} className="text-info" />;
            default: return <DollarSign size={14} />;
        }
    };

    const getPaymentMethodLabel = (method: Payment['method']) => {
        switch (method) {
            case 'cash': return 'Cash';
            case 'bank_transfer': return 'Bank Transfer';
            case 'cheque': return 'Cheque';
            case 'online': return 'Online';
            default: return method;
        }
    };

    // Filter payments
    const filteredPayments = useMemo(() => {
        if (paymentFilter === 'all') return plot.payments;
        return plot.payments.filter(p => p.status === paymentFilter);
    }, [paymentFilter, plot.payments]);

    const displayedPayments = showAllPayments ? filteredPayments : filteredPayments.slice(0, 5);
    const displayedNotes = showAllNotes ? plot.notes : plot.notes.slice(0, 3);
    const displayedDocs = showAllDocs ? plot.documents : plot.documents.slice(0, 3);

    // Calculate summary stats
    const totalInstallments = plot.installmentPlan.totalInstallments;
    const paidInstallments = plot.installmentPlan.paidInstallments;
    const completionPercentage = (paidInstallments / totalInstallments) * 100;

    return (
        <div className="min-h-screen bg-background dark:bg-background">
            {/* Navigation Bar */}
            <nav className="sticky top-0 z-50 bg-surface dark:bg-surface-elevated border-b border-border dark:border-border backdrop-blur-sm">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/plot-map')}
                                className="p-2 rounded-lg hover:bg-muted dark:hover:bg-surface-elevated transition-colors"
                            >
                                <ArrowLeft size={20} className="text-muted-foreground" />
                            </button>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-linear-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                                    <Home size={18} className="text-white" />
                                </div>
                                <span className="text-lg font-bold text-foreground dark:text-white">
                                    Plot #{plot.number} Details
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="p-2 rounded-lg hover:bg-muted dark:hover:bg-surface-elevated transition-colors">
                                <Download size={18} className="text-muted-foreground" />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-muted dark:hover:bg-surface-elevated transition-colors">
                                <Printer size={18} className="text-muted-foreground" />
                            </button>
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-lg hover:bg-muted dark:hover:bg-surface-elevated transition-colors"
                            >
                                {theme === 'dark' ? (
                                    <Sun size={20} className="text-warning" />
                                ) : (
                                    <Moon size={20} className="text-muted-foreground" />
                                )}
                            </button>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-semibold text-primary">
                                        {user.email?.[0]?.toUpperCase() || 'U'}
                                    </span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 rounded-lg hover:bg-muted dark:hover:bg-surface-elevated transition-colors"
                                >
                                    <LogOut size={18} className="text-muted-foreground" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Plot Header Card */}
                        <Card className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h1 className="text-2xl font-bold text-foreground dark:text-white">
                                            Plot #{plot.number}
                                        </h1>
                                        <StatusBadge status={plot.status} />
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                        <span>Block {plot.block}</span>
                                        <span>• Street {plot.street}</span>
                                        <span>• Sector {plot.sector}</span>
                                        <span>• {plot.size} Marla</span>
                                        {plot.corner && (
                                            <span className="text-primary font-medium">Corner Plot</span>
                                        )}
                                        {plot.parkFace > 0 && (
                                            <span className="text-secondary">Park Face: {plot.parkFace}%</span>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-4 md:mt-0 flex gap-2">
                                    <Button
                                        variant="secondary"
                                        className="flex items-center gap-1"
                                        onClick={() => setIsEditPlotModalOpen(true)}
                                    >
                                        <Edit size={14} />
                                        Edit Plot
                                    </Button>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
                                <div>
                                    <p className="text-xs text-muted-foreground">Total Price</p>
                                    <p className="text-lg font-bold text-foreground dark:text-white">
                                        {formatCurrency(plot.totalAmount)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Rate per Marla</p>
                                    <p className="text-lg font-bold text-foreground dark:text-white">
                                        {formatCurrency(plot.ratePerMarla)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Total Paid</p>
                                    <p className="text-lg font-bold text-success">
                                        {formatCurrency(plot.totalPaid)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Pending</p>
                                    <p className="text-lg font-bold text-danger">
                                        {formatCurrency(plot.pendingAmount)}
                                    </p>
                                </div>
                            </div>
                        </Card>

                        {/* Owner Information */}
                        <Card className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-foreground dark:text-white flex items-center gap-2">
                                    <User size={20} className="text-primary" />
                                    Owner Information
                                </h2>
                                <Button
                                    variant="secondary"
                                    className="flex items-center gap-1"
                                    onClick={() => setIsEditOwnerModalOpen(true)}
                                >
                                    <Edit size={14} />
                                    Edit Owner
                                </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                            <span className="text-lg font-semibold text-primary">
                                                {plot.owner.name.charAt(0)}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground dark:text-white">
                                                {plot.owner.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">Owner</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Phone size={14} className="text-muted-foreground" />
                                        <span>{plot.owner.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Mail size={14} className="text-muted-foreground" />
                                        <span>{plot.owner.email}</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm">
                                        <FileText size={14} className="text-muted-foreground" />
                                        <span>CNIC: {plot.owner.cnic}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPin size={14} className="text-muted-foreground" />
                                        <span className="text-sm">{plot.owner.address}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar size={14} className="text-muted-foreground" />
                                        <span>Joined: {formatDate(plot.owner.joinDate)}</span>
                                    </div>
                                    {plot.owner.occupation && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Briefcase size={14} className="text-muted-foreground" />
                                            <span>{plot.owner.occupation}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>

                        {/* Payment History */}
                        <Card className="p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                                <h2 className="text-lg font-semibold text-foreground dark:text-white flex items-center gap-2">
                                    <DollarSign size={20} className="text-primary" />
                                    Payment History
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    <select
                                        value={paymentFilter}
                                        onChange={(e) => setPaymentFilter(e.target.value as 'all' | 'paid' | 'pending' | 'overdue')}
                                        className="px-2 py-1 bg-surface dark:bg-surface-elevated border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                                    >
                                        <option value="all">All Payments</option>
                                        <option value="paid">Paid</option>
                                        <option value="pending">Pending</option>
                                        <option value="overdue">Overdue</option>
                                    </select>
                                    <Button
                                        className="flex items-center gap-1"
                                        onClick={() => setIsAddPaymentModalOpen(true)}
                                    >
                                        <Plus size={14} />
                                        Add Payment
                                    </Button>
                                </div>
                            </div>

                            {/* Installment Progress */}
                            <div className="mb-4 p-4 bg-surface dark:bg-surface-elevated rounded-lg">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-muted-foreground">Installment Progress</span>
                                    <span className="font-medium">
                                        {paidInstallments}/{totalInstallments}
                                    </span>
                                </div>
                                <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary rounded-full transition-all"
                                        style={{ width: `${completionPercentage}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                                    <span>{completionPercentage.toFixed(0)}% Complete</span>
                                    {plot.installmentPlan.nextDueDate && (
                                        <span>Next Due: {formatDate(plot.installmentPlan.nextDueDate)}</span>
                                    )}
                                </div>
                            </div>

                            {/* Payment Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-xs text-muted-foreground border-b border-border">
                                            <th className="text-left py-2 px-3">Date</th>
                                            <th className="text-left py-2 px-3">Description</th>
                                            <th className="text-left py-2 px-3">Receipt</th>
                                            <th className="text-left py-2 px-3">Method</th>
                                            <th className="text-right py-2 px-3">Amount</th>
                                            <th className="text-center py-2 px-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {displayedPayments.map((payment) => (
                                            <tr key={payment.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                                                <td className="py-3 px-3 text-sm text-foreground dark:text-white whitespace-nowrap">
                                                    {formatDate(payment.date)}
                                                </td>
                                                <td className="py-3 px-3 text-sm text-foreground dark:text-white">
                                                    {payment.description}
                                                </td>
                                                <td className="py-3 px-3 text-sm font-mono text-foreground dark:text-white">
                                                    {payment.receiptNo}
                                                </td>
                                                <td className="py-3 px-3 text-sm flex items-center gap-1">
                                                    {getPaymentMethodIcon(payment.method)}
                                                    {getPaymentMethodLabel(payment.method)}
                                                </td>
                                                <td className="py-3 px-3 text-sm text-right font-medium text-foreground dark:text-white">
                                                    {formatCurrency(payment.amount)}
                                                </td>
                                                <td className="py-3 px-3 text-center">
                                                    <PaymentStatusBadge status={payment.status} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {filteredPayments.length > 5 && (
                                <button
                                    onClick={() => setShowAllPayments(!showAllPayments)}
                                    className="mt-4 text-sm text-primary hover:text-primary-hover transition-colors flex items-center gap-1"
                                >
                                    {showAllPayments ? (
                                        <>Show Less <ChevronUp size={16} /></>
                                    ) : (
                                        <>View All Payments ({filteredPayments.length}) <ChevronDown size={16} /></>
                                    )}
                                </button>
                            )}

                            {/* Payment Summary */}
                            <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-border">
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground">Total Received</p>
                                    <p className="text-sm font-bold text-success">{formatCurrency(plot.totalPaid)}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground">Total Pending</p>
                                    <p className="text-sm font-bold text-danger">{formatCurrency(plot.pendingAmount)}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground">Total Installments</p>
                                    <p className="text-sm font-bold text-foreground dark:text-white">{totalInstallments}</p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <Card className="p-6">
                            <h2 className="text-sm font-semibold text-foreground dark:text-white mb-4">
                                Quick Actions
                            </h2>
                            <div className="space-y-2">
                                <Button
                                    className="w-full justify-start"
                                    onClick={() => setIsAddPaymentModalOpen(true)}
                                >
                                    <Plus size={16} className="mr-2" />
                                    Add Payment
                                </Button>
                                <Button variant="secondary" className="w-full justify-start">
                                    <Receipt size={16} className="mr-2" />
                                    Generate Receipt
                                </Button>
                                <Button variant="secondary" className="w-full justify-start">
                                    <Download size={16} className="mr-2" />
                                    Download Statement
                                </Button>
                                <Button variant="secondary" className="w-full justify-start">
                                    <Eye size={16} className="mr-2" />
                                    View All Documents
                                </Button>
                            </div>
                        </Card>

                        {/* Documents */}
                        <Card className="p-6">
                            <h2 className="text-sm font-semibold text-foreground dark:text-white mb-4 flex items-center gap-2">
                                <FileText size={16} className="text-primary" />
                                Documents ({plot.documents.length})
                            </h2>
                            <div className="space-y-2">
                                {displayedDocs.map((doc) => (
                                    <div
                                        key={doc.name}
                                        className="flex items-center justify-between p-2 bg-surface dark:bg-surface-elevated rounded-lg hover:bg-muted transition-colors cursor-pointer"
                                        onClick={() => handleViewDocument(doc)}
                                    >
                                        <div>
                                            <p className="text-sm font-medium text-foreground dark:text-white">
                                                {doc.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {doc.type} • {formatDate(doc.uploadedAt)}
                                            </p>
                                        </div>
                                        <button className="p-1 hover:bg-primary/10 rounded transition-colors">
                                            <Eye size={14} className="text-muted-foreground hover:text-primary" />
                                        </button>
                                    </div>
                                ))}
                                {plot.documents.length > 3 && (
                                    <button
                                        onClick={() => setShowAllDocs(!showAllDocs)}
                                        className="text-sm text-primary hover:text-primary-hover transition-colors flex items-center gap-1"
                                    >
                                        {showAllDocs ? (
                                            <>Show Less <ChevronUp size={14} /></>
                                        ) : (
                                            <>View All ({plot.documents.length}) <ChevronDown size={14} /></>
                                        )}
                                    </button>
                                )}
                            </div>
                        </Card>

                        {/* Notes */}
                        <Card className="p-6">
                            <h2 className="text-sm font-semibold text-foreground dark:text-white mb-4 flex items-center gap-2">
                                <FileText size={16} className="text-primary" />
                                Notes & Activity
                            </h2>
                            <div className="space-y-3">
                                {displayedNotes.map((note) => (
                                    <div key={note.id} className="p-3 bg-surface dark:bg-surface-elevated rounded-lg">
                                        <p className="text-sm text-foreground dark:text-white">
                                            {note.content}
                                        </p>
                                        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                                            <span>{note.createdBy}</span>
                                            <span>{note.createdAt}</span>
                                        </div>
                                    </div>
                                ))}
                                {plot.notes.length > 3 && (
                                    <button
                                        onClick={() => setShowAllNotes(!showAllNotes)}
                                        className="text-sm text-primary hover:text-primary-hover transition-colors flex items-center gap-1"
                                    >
                                        {showAllNotes ? (
                                            <>Show Less <ChevronUp size={14} /></>
                                        ) : (
                                            <>View All Notes ({plot.notes.length}) <ChevronDown size={14} /></>
                                        )}
                                    </button>
                                )}
                                <Button
                                    variant="secondary"
                                    className="w-full justify-start"
                                    onClick={() => setIsAddNoteModalOpen(true)}
                                >
                                    <Plus size={14} className="mr-2" />
                                    Add Note
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </main>

            {/* Modals */}
            <EditPlotModal
                isOpen={isEditPlotModalOpen}
                onClose={() => setIsEditPlotModalOpen(false)}
                plotData={{
                    number: plot.number,
                    size: plot.size,
                    block: plot.block,
                    street: plot.street,
                    sector: plot.sector,
                    price: plot.price,
                    ratePerMarla: plot.ratePerMarla,
                    parkFace: plot.parkFace,
                    corner: plot.corner
                }}
                onSave={handleEditPlot}
            />

            <EditOwnerModal
                isOpen={isEditOwnerModalOpen}
                onClose={() => setIsEditOwnerModalOpen(false)}
                ownerData={{
                    name: plot.owner.name,
                    phone: plot.owner.phone,
                    email: plot.owner.email,
                    cnic: plot.owner.cnic,
                    address: plot.owner.address,
                    occupation: plot.owner.occupation
                }}
                onSave={handleEditOwner}
            />

            <AddPaymentModal
                isOpen={isAddPaymentModalOpen}
                onClose={() => setIsAddPaymentModalOpen(false)}
                onSave={handleAddPayment}
            />

            <AddNoteModal
                isOpen={isAddNoteModalOpen}
                onClose={() => setIsAddNoteModalOpen(false)}
                onSave={handleAddNote}
            />

            <ViewDocumentModal
                isOpen={!!selectedDocument}
                onClose={() => setSelectedDocument(null)}
                document={selectedDocument}
            />
        </div>
    );
};

export default PropertiesDetail;