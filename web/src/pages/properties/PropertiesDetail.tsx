import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Home,
    User,
    DollarSign,
    Calendar,
    Phone,
    Mail,
    MapPin,
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
import { Modal } from '../../components/ui/Modal';

import { AddPaymentForm, EditOwnerForm, EditPropertyForm, type AddPaymentFormData, type EditOwnerFormData, type EditPropertyFormData, } from '../../forms';
import { AddNoteForm } from '../../forms/AddNoteForm';
import { ViewDocumentModal } from '../../pages/properties/ViewDocument';
import type { Payment, Document, Note, PaymentStatus, PaymentFilter } from '../../types';
import { mockPlotDetail } from '../../data';
import { PaymentStatusBadge, PropertyStatusBadge } from '../../components/badges';


const Briefcase: React.FC<{ size?: number; className?: string }> = ({ size = 16, className = '' }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const PropertiesDetail: React.FC = () => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // UI State
    const [showAllPayments, setShowAllPayments] = useState(false);
    const [showAllNotes, setShowAllNotes] = useState(false);
    const [showAllDocs, setShowAllDocs] = useState(false);
    const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>('all');

    // Modal States
    const [editPlotModalOpen, setEditPlotModalOpen] = useState(false);
    const [editOwnerModalOpen, setEditOwnerModalOpen] = useState(false);
    const [addPaymentModalOpen, setAddPaymentModalOpen] = useState(false);
    const [addNoteModalOpen, setAddNoteModalOpen] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Get plot data
    // const { id } = useParams<{ id: string }>();
    const selectedProperty = mockPlotDetail;

    // Handlers
    const handleEditPlot = (data: EditPropertyFormData) => {
        setIsLoading(true);
        setTimeout(() => {
            console.log('Plot updated:', data);
            setIsLoading(false);
            setEditPlotModalOpen(false);
        }, 1000);
    };

    const handleEditOwner = (data: EditOwnerFormData) => {
        setIsLoading(true);
        setTimeout(() => {
            console.log('Owner updated:', data);
            setIsLoading(false);
            setEditOwnerModalOpen(false);
        }, 1000);
    };

    const handleAddPayment = (data: AddPaymentFormData) => {
        setIsLoading(true);
        setTimeout(() => {
            console.log('Payment added:', data);
            setIsLoading(false);
            setAddPaymentModalOpen(false);
        }, 1000);
    };

    const handleAddNote = (content: string) => {
        setIsLoading(true);
        setTimeout(() => {
            console.log('Note added:', content);
            setIsLoading(false);
            setAddNoteModalOpen(false);
        }, 1000);
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
        if (paymentFilter === 'all') return selectedProperty.payments;
        return selectedProperty.payments.filter(p => p.status === paymentFilter);
    }, [paymentFilter, selectedProperty.payments]);

    const displayedPayments = showAllPayments ? filteredPayments : filteredPayments.slice(0, 5);
    const displayedNotes = showAllNotes ? selectedProperty.notes : selectedProperty.notes.slice(0, 3);
    const displayedDocs = showAllDocs ? selectedProperty.documents : selectedProperty.documents.slice(0, 3);

    const totalInstallments = selectedProperty.installmentPlan.totalInstallments;
    const paidInstallments = selectedProperty.installmentPlan.paidInstallments;
    const completionPercentage = (paidInstallments / totalInstallments) * 100;

    return (
        <div className="min-h-screen bg-background">
            {/* Navigation Bar */}
            <nav className="sticky top-0 z-40 bg-card border-b border-border backdrop-blur-sm">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between min-h-16 py-2 gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2 rounded-lg hover:bg-muted transition-colors"
                            >
                                <ArrowLeft size={20} className="text-muted-foreground" />
                            </button>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-linear-to-br from-primary to-primary-hover rounded-lg flex items-center justify-center">
                                    <Home size={18} className="text-primary-foreground" />
                                </div>
                                <span className="text-base sm:text-lg font-bold text-foreground truncate">
                                    Plot #{selectedProperty.number} Details
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-1 sm:gap-3 shrink-0">
                            <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                                <Download size={18} className="text-muted-foreground" />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                                <Printer size={18} className="text-muted-foreground" />
                            </button>
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-lg hover:bg-muted transition-colors"
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
                                    className="p-2 rounded-lg hover:bg-muted transition-colors"
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
                                        <h1 className="text-2xl font-bold text-foreground">
                                            Plot #{selectedProperty.number}
                                        </h1>
                                        <PropertyStatusBadge status={selectedProperty.status} />
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                        <span>Block {selectedProperty.block}</span>
                                        <span>• Street {selectedProperty.street}</span>
                                        <span>• {selectedProperty.size} Marla</span>
                                        {selectedProperty.isCorner && (
                                            <span className="text-primary font-medium">Corner selectedProperty</span>
                                        )}
                                        {selectedProperty.parkFaceCharges > 0 && (
                                            <span className="text-primary">Park Face: {selectedProperty.parkFaceCharges}%</span>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-4 md:mt-0 flex gap-2">
                                    <Button
                                        variant="secondary"
                                        className="flex items-center gap-1"
                                        onClick={() => setEditPlotModalOpen(true)}
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
                                    <p className="text-base sm:text-lg font-bold text-foreground truncate">
                                        {formatCurrency(selectedProperty.totalAmount)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Rate per Marla</p>
                                    <p className="text-base sm:text-lg font-bold text-foreground truncate">
                                        {formatCurrency(selectedProperty.ratePerMarla)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Total Paid</p>
                                    <p className="text-lg font-bold text-success">
                                        {formatCurrency(selectedProperty.totalPaid)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Pending</p>
                                    <p className="text-lg font-bold text-danger">
                                        {formatCurrency(selectedProperty.pendingAmount)}
                                    </p>
                                </div>
                            </div>
                        </Card>

                        {/* Owner Information */}
                        <Card className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                    <User size={20} className="text-primary" />
                                    Owner Information
                                </h2>
                                <Button
                                    variant="secondary"
                                    className="flex items-center gap-1"
                                    onClick={() => setEditOwnerModalOpen(true)}
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
                                                {selectedProperty.owner.name.charAt(0)}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">
                                                {selectedProperty.owner.title} {selectedProperty.owner.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">Owner</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Phone size={14} className="text-muted-foreground" />
                                        <span>{selectedProperty.owner.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Mail size={14} className="text-muted-foreground" />
                                        <span>{selectedProperty.owner.email}</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm">
                                        <FileText size={14} className="text-muted-foreground" />
                                        <span>CNIC: {selectedProperty.owner.cnic}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPin size={14} className="text-muted-foreground" />
                                        <span className="text-sm">{selectedProperty.owner.address}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar size={14} className="text-muted-foreground" />
                                        <span>Joined: {formatDate(selectedProperty.owner.joinDate || '')}</span>
                                    </div>
                                    {selectedProperty.owner.occupation && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Briefcase size={14} className="text-muted-foreground" />
                                            <span>{selectedProperty.owner.occupation}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>

                        {/* Payment History */}
                        <Card className="p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                    <DollarSign size={20} className="text-primary" />
                                    Payment History
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    <select
                                        value={paymentFilter}
                                        onChange={(e) => setPaymentFilter(e.target.value as PaymentStatus)}
                                        className="px-2 py-1 bg-input text-foreground border border-border rounded-lg text-sm focus:ring-2 focus:ring-ring focus:border-primary outline-none"
                                    >
                                        <option value="all">All Payments</option>
                                        <option value="paid">Paid</option>
                                        <option value="pending">Pending</option>
                                        <option value="overdue">Overdue</option>
                                    </select>
                                    <Button
                                        className="flex items-center gap-1"
                                        onClick={() => setAddPaymentModalOpen(true)}
                                    >
                                        <Plus size={14} />
                                        Add Payment
                                    </Button>
                                </div>
                            </div>

                            {/* Installment Progress */}
                            <div className="mb-4 p-4 bg-muted rounded-lg">
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
                                    {selectedProperty.installmentPlan.nextDueDate && (
                                        <span>Next Due: {formatDate(selectedProperty.installmentPlan.nextDueDate)}</span>
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
                                        {displayedPayments.map((payment: Payment) => (
                                            <tr key={payment.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                                                <td className="py-3 px-3 text-sm text-foreground whitespace-nowrap">
                                                    {formatDate(payment.date)}
                                                </td>
                                                <td className="py-3 px-3 text-sm text-foreground">
                                                    {payment.description}
                                                </td>
                                                <td className="py-3 px-3 text-sm font-mono text-foreground">
                                                    {payment.receiptNo}
                                                </td>
                                                <td className="py-3 px-3 text-sm flex items-center gap-1">
                                                    {getPaymentMethodIcon(payment.method)}
                                                    {getPaymentMethodLabel(payment.method)}
                                                </td>
                                                <td className="py-3 px-3 text-sm text-right font-medium text-foreground">
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
                                    <p className="text-sm font-bold text-success">{formatCurrency(selectedProperty.totalPaid)}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground">Total Pending</p>
                                    <p className="text-sm font-bold text-danger">{formatCurrency(selectedProperty.pendingAmount)}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground">Total Installments</p>
                                    <p className="text-sm font-bold text-foreground">{totalInstallments}</p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <Card className="p-6">
                            <h2 className="text-sm font-semibold text-foreground mb-4">
                                Quick Actions
                            </h2>
                            <div className="space-y-2">
                                <Button
                                    className="w-full justify-start"
                                    onClick={() => setAddPaymentModalOpen(true)}
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
                            <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                                <FileText size={16} className="text-primary" />
                                Documents ({selectedProperty.documents.length})
                            </h2>
                            <div className="space-y-2">
                                {displayedDocs.map((doc: Document) => (
                                    <div
                                        key={doc.name}
                                        className="flex items-center justify-between p-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer"
                                        onClick={() => setSelectedDocument(doc)}
                                    >
                                        <div>
                                            <p className="text-sm font-medium text-foreground">
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
                                {selectedProperty.documents.length > 3 && (
                                    <button
                                        onClick={() => setShowAllDocs(!showAllDocs)}
                                        className="text-sm text-primary hover:text-primary-hover transition-colors flex items-center gap-1"
                                    >
                                        {showAllDocs ? (
                                            <>Show Less <ChevronUp size={14} /></>
                                        ) : (
                                            <>View All ({selectedProperty.documents.length}) <ChevronDown size={14} /></>
                                        )}
                                    </button>
                                )}
                            </div>
                        </Card>

                        {/* Notes */}
                        <Card className="p-6">
                            <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                                <FileText size={16} className="text-primary" />
                                Notes & Activity
                            </h2>
                            <div className="space-y-3">
                                {displayedNotes.map((note: Note) => (
                                    <div key={note.id} className="p-3 bg-muted rounded-lg">
                                        <p className="text-sm text-foreground">
                                            {note.content}
                                        </p>
                                        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                                            <span>{note.createdBy}</span>
                                            <span>{note.createdAt}</span>
                                        </div>
                                    </div>
                                ))}
                                {selectedProperty.notes.length > 3 && (
                                    <button
                                        onClick={() => setShowAllNotes(!showAllNotes)}
                                        className="text-sm text-primary hover:text-primary-hover transition-colors flex items-center gap-1"
                                    >
                                        {showAllNotes ? (
                                            <>Show Less <ChevronUp size={14} /></>
                                        ) : (
                                            <>View All Notes ({selectedProperty.notes.length}) <ChevronDown size={14} /></>
                                        )}
                                    </button>
                                )}
                                <Button
                                    variant="secondary"
                                    className="w-full justify-start"
                                    onClick={() => setAddNoteModalOpen(true)}
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
            <Modal
                isOpen={editPlotModalOpen}
                onClose={() => setEditPlotModalOpen(false)}
                title="Edit Plot Details"
                maxWidth="2xl"
            >
                <EditPropertyForm
                    initialData={selectedProperty}
                    onSave={handleEditPlot}
                    onCancel={() => setEditPlotModalOpen(false)}
                    isLoading={isLoading}
                />
            </Modal>

            <Modal
                isOpen={editOwnerModalOpen}
                onClose={() => setEditOwnerModalOpen(false)}
                title="Edit Owner Information"
                maxWidth="4xl"
            >
                <EditOwnerForm
                    initialData={{
                        title: selectedProperty.owner.title || 'Mr.',
                        name: selectedProperty.owner.name,
                        relation: selectedProperty.owner.relation || 'S/O',
                        relationName: selectedProperty.owner.relationName || '',
                        cnic: selectedProperty.owner.cnic,
                        phone: selectedProperty.owner.phone,
                        whatsapp: selectedProperty.owner.whatsapp || '',
                        email: selectedProperty.owner.email,
                        occupation: selectedProperty.owner.occupation || '',
                        address: selectedProperty.owner.address,
                        nominee: selectedProperty.owner.nominee || null,
                        joinDate: selectedProperty.owner.joinDate || ''
                    }}
                    onSave={handleEditOwner}
                    onCancel={() => setEditOwnerModalOpen(false)}
                    isLoading={isLoading}
                />
            </Modal>

            <Modal
                isOpen={addPaymentModalOpen}
                onClose={() => setAddPaymentModalOpen(false)}
                title="Add Payment"
                maxWidth="md"
            >
                <AddPaymentForm
                    onSave={handleAddPayment}
                    onCancel={() => setAddPaymentModalOpen(false)}
                    isLoading={isLoading}
                />
            </Modal>

            <Modal
                isOpen={addNoteModalOpen}
                onClose={() => setAddNoteModalOpen(false)}
                title="Add Note"
                maxWidth="md"
            >
                <AddNoteForm
                    onSave={handleAddNote}
                    onCancel={() => setAddNoteModalOpen(false)}
                    isLoading={isLoading}
                />
            </Modal>

            {/* View Document Modal */}
            <ViewDocumentModal
                isOpen={!!selectedDocument}
                onClose={() => setSelectedDocument(null)}
                document={selectedDocument}
            />
        </div>
    );
};

export default PropertiesDetail;