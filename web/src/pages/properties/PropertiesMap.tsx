import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Home,
    Map,
    ArrowLeft,
    User,
    Search,
    Sun,
    Moon,
    LogOut,
    CheckCircle,
    XCircle,
    Clock as ClockIcon,
    AlertCircle,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { TextField } from '../../components/ui/TextField';
import { Select } from '../../components/ui/Select';
import { mockProperties } from '../../data';
import type { PropertyData } from '../../types';
import { EditPropertyForm } from '../../forms';

// ---------- Status filter options ----------
const STATUS_OPTIONS = [
    { value: 'all', label: 'All' },
    { value: 'available', label: 'Available' },
    { value: 'sold', label: 'Sold' },
    { value: 'reserved', label: 'Reserved' },
    { value: 'pending', label: 'Pending' },
];

const PropertiesMap: React.FC = () => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    // Lifted into state so booking actually persists in this session,
    // instead of reading a static import that never changes.
    const [properties, setProperties] = useState<PropertyData[]>(mockProperties);

    const [selectedProperty, setSelectedProperty] = useState<PropertyData | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterBlock, setFilterBlock] = useState<string>('all');
    const [bookingProperty, setBookingProperty] = useState<PropertyData | null>(null);

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    // ---------- Unique blocks for filter ----------
    const blockOptions = useMemo(() => {
        const uniqueBlocks = new Set(properties.map((p) => p.block));
        return [
            { value: 'all', label: 'All Blocks' },
            ...Array.from(uniqueBlocks).map((b) => ({
                value: b,
                label: `Block ${b}`,
            })),
        ];
    }, [properties]);

    // ---------- Filter & search ----------
    const filteredProperties = useMemo(() => {
        return properties.filter((property) => {
            const searchMatch =
                property.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                property.block.toLowerCase().includes(searchTerm.toLowerCase()) ||
                property.owner?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                property.owner?.phone?.includes(searchTerm);

            const statusMatch =
                filterStatus === 'all' || property.status === filterStatus;

            const blockMatch =
                filterBlock === 'all' || property.block === filterBlock;

            return searchMatch && statusMatch && blockMatch;
        });
    }, [properties, searchTerm, filterStatus, filterBlock]);

    // ---------- Status counts ----------
    const statusCounts = useMemo(() => {
        const counts: Record<string, number> = { all: properties.length };
        properties.forEach((property) => {
            counts[property.status] = (counts[property.status] || 0) + 1;
        });
        return counts;
    }, [properties]);

    // ---------- Status helpers ----------
    const getStatusConfig = (status: PropertyData['status']) => {
        const configs = {
            available: {
                label: 'Available',
                icon: CheckCircle,
                className: 'bg-success/10 text-success border-success/20',
                dotColor: 'bg-success',
            },
            sold: {
                label: 'Sold',
                icon: XCircle,
                className:
                    'bg-neutral-500/10 text-neutral-500 border-neutral-500/20',
                dotColor: 'bg-neutral-500',
            },
            reserved: {
                label: 'Reserved',
                icon: ClockIcon,
                className: 'bg-warning/10 text-warning border-warning/20',
                dotColor: 'bg-warning',
            },
            pending: {
                label: 'Pending Payment',
                icon: AlertCircle,
                className: 'bg-danger/10 text-danger border-danger/20',
                dotColor: 'bg-danger',
            },
        };
        return configs[status];
    };

    const getStatusBorderColor = (status: PropertyData['status']) => {
        switch (status) {
            case 'available':
                return 'border-success/50 hover:border-success';
            case 'sold':
                return 'border-neutral-500/50 hover:border-neutral-500';
            case 'reserved':
                return 'border-warning/50 hover:border-warning';
            case 'pending':
                return 'border-danger/50 hover:border-danger';
            default:
                return 'border-border';
        }
    };

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-PK', {
            style: 'currency',
            currency: 'PKR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);

    // Called by EditPropertyForm (mode="book") on submit — replaces the old dead handleBook.
    const handleBookingSave = (updated: PropertyData) => {
        setProperties((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        setBookingProperty(null);
        setSelectedProperty(null);
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Navigation Bar */}
            <nav className="sticky top-0 z-40 bg-card border-b border-border backdrop-blur-sm">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2 rounded-lg hover:bg-muted transition-colors"
                                aria-label="Back to Dashboard"
                            >
                                <ArrowLeft size={20} className="text-muted-foreground" />
                            </button>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-linear-to-br from-primary to-primary-hover rounded-lg flex items-center justify-center">
                                    <Map size={18} className="text-primary-foreground" />
                                </div>
                                <span className="text-lg font-bold text-foreground">
                                    Properties
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-lg hover:bg-muted transition-colors"
                                aria-label="Toggle theme"
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
                                    aria-label="Logout"
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
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-foreground">
                        Available Properties
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {filteredProperties.length} properties found
                    </p>
                </div>

                {/* Search & Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1">
                        <TextField
                            icon={Search}
                            type="text"
                            placeholder="Search by property number, block, owner name, or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <div className="flex gap-2 flex-wrap">
                            {STATUS_OPTIONS.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => setFilterStatus(option.value)}
                                    className={`
                                        px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                                        ${filterStatus === option.value
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-card text-muted-foreground hover:text-foreground border border-border'
                                        }
                                    `}
                                >
                                    {option.label}
                                    <span className="ml-1 text-xs opacity-70">
                                        ({statusCounts[option.value] || 0})
                                    </span>
                                </button>
                            ))}
                        </div>

                        <div className="min-w-35">
                            <Select
                                name="blockFilter"
                                value={filterBlock}
                                onChange={(e) => setFilterBlock(e.target.value)}
                                options={blockOptions}
                                placeholder=""
                            />
                        </div>
                    </div>
                </div>

                {/* Property Cards Grid */}
                {filteredProperties.length === 0 ? (
                    <div className="text-center py-12">
                        <Home size={48} className="mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium text-foreground">No properties found</h3>
                        <p className="text-muted-foreground">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredProperties.map((property) => {
                            const statusConfig = getStatusConfig(property.status);
                            const StatusIcon = statusConfig.icon;

                            return (
                                <div
                                    key={property.id}
                                    onClick={() => setSelectedProperty(property)}
                                    className={`
                                        cursor-pointer transition-all duration-200
                                        bg-card rounded-xl border-2
                                        ${getStatusBorderColor(property.status)}
                                        hover:shadow-lg hover:scale-[1.02]
                                        p-4
                                    `}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="text-xl font-bold text-foreground">
                                                Property #{property.number}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                Block {property.block} • Street {property.street}
                                            </p>
                                        </div>
                                        <div
                                            className={`
                                                flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
                                                ${statusConfig.className}
                                            `}
                                        >
                                            <StatusIcon size={12} />
                                            {statusConfig.label}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Size</span>
                                            <span className="font-medium text-foreground">{property.size} Marla</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Price</span>
                                            <span className="font-semibold text-primary">{formatCurrency(property.price)}</span>
                                        </div>
                                        {property.owner && (
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">Owner</span>
                                                <span className="font-medium text-foreground truncate max-w-30">
                                                    {property.owner.name}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-3 flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${statusConfig.dotColor} animate-pulse`} />
                                        <span className="text-xs text-muted-foreground">Click for details</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            {/* Property Details Modal */}
            <Modal
                title={`Property #${selectedProperty?.number}`}
                isOpen={!!selectedProperty}
                onClose={() => setSelectedProperty(null)}
                maxWidth="md"
            >
                {selectedProperty && (
                    <>
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-muted-foreground">
                                    Block {selectedProperty.block} • Street {selectedProperty.street}
                                </p>
                                <span
                                    className={`
                                        px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5
                                        ${getStatusConfig(selectedProperty.status).className}
                                    `}
                                >
                                    {React.createElement(getStatusConfig(selectedProperty.status).icon, { size: 14 })}
                                    {getStatusConfig(selectedProperty.status).label}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="p-3 bg-muted rounded-lg">
                                <p className="text-xs text-muted-foreground">Size</p>
                                <p className="font-semibold text-foreground">{selectedProperty.size} Marla</p>
                            </div>
                            <div className="p-3 bg-muted rounded-lg">
                                <p className="text-xs text-muted-foreground">Price</p>
                                <p className="font-semibold text-foreground">{formatCurrency(selectedProperty.price)}</p>
                            </div>
                        </div>

                        {selectedProperty.owner?.name ? (
                            <div className="mb-6 p-4 bg-primary/5 rounded-lg border border-primary/10">
                                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                                    <User size={16} />
                                    Owner Information
                                </h3>
                                <div className="space-y-2">
                                    <p className="text-sm">
                                        <span className="text-muted-foreground">Name:</span>{' '}
                                        <span className="font-medium">{selectedProperty.owner.name}</span>
                                    </p>
                                    <p className="text-sm">
                                        <span className="text-muted-foreground">Phone:</span>{' '}
                                        <span className="font-medium">{selectedProperty.owner.phone}</span>
                                    </p>
                                    <p className="text-sm">
                                        <span className="text-muted-foreground">Email:</span>{' '}
                                        <span className="font-medium">{selectedProperty.owner.email}</span>
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="mb-6 p-4 bg-success/5 rounded-lg border border-success/10 text-center">
                                <CheckCircle size={24} className="mx-auto text-success mb-2" />
                                <p className="text-sm text-muted-foreground">This property is available for sale</p>
                            </div>
                        )}

                        {selectedProperty.owner?.name && (
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-foreground mb-3">Payment Details</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 bg-success/5 rounded-lg border border-success/10">
                                        <p className="text-xs text-muted-foreground">Total Paid</p>
                                        <p className="font-semibold text-success">
                                            {formatCurrency(selectedProperty.totalPaid || 0)}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-danger/5 rounded-lg border border-danger/10">
                                        <p className="text-xs text-muted-foreground">Pending</p>
                                        <p className="font-semibold text-danger">
                                            {formatCurrency(selectedProperty.pendingAmount || 0)}
                                        </p>
                                    </div>
                                </div>
                                {selectedProperty.bookingDate && (
                                    <p className="mt-2 text-xs text-muted-foreground">
                                        Booked on:{' '}
                                        {new Date(selectedProperty.bookingDate).toLocaleDateString('en-PK', {
                                            day: '2-digit',
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="flex gap-3">
                            <Button
                                className="flex-1"
                                onClick={() => {
                                    navigate(`/properties/${selectedProperty.id}`);
                                    setSelectedProperty(null);
                                }}
                            >
                                View Full Details
                            </Button>
                            {selectedProperty.status === 'available' && (
                                <Button
                                    variant="secondary"
                                    className="flex-1"
                                    onClick={() => {
                                        setBookingProperty(selectedProperty);
                                        setSelectedProperty(null);
                                    }}
                                >
                                    Book Property
                                </Button>
                            )}
                        </div>
                    </>
                )}
            </Modal>

            {/* Booking Modal */}
            <Modal
                title={`Book Property #${bookingProperty?.number}`}
                isOpen={!!bookingProperty}
                onClose={() => setBookingProperty(null)}
                maxWidth="3xl"
            >
                {bookingProperty && (
                    <EditPropertyForm
                        mode="book"
                        initialData={bookingProperty}
                        onSave={handleBookingSave}
                        onCancel={() => setBookingProperty(null)}
                    />
                )}
            </Modal>
        </div>
    );
};

export default PropertiesMap;