import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Home,
    Map,
    ArrowLeft,
    X,
    User,
    Search,
    Sun,
    Moon,
    LogOut,
    CheckCircle,
    XCircle,
    Clock as ClockIcon,
    AlertCircle
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

// Types
interface Properties {
    id: string;
    number: string;
    size: string;
    block: string;
    street: string;
    status: 'available' | 'sold' | 'reserved' | 'pending';
    price: number;
    owner?: {
        name: string;
        phone: string;
        email: string;
    };
    bookingDate?: string;
    totalPaid?: number;
    pendingAmount?: number;
}

// Mock data
const mockPlots: Properties[] = [
    {
        id: '1',
        number: '1',
        size: '10',
        block: 'A',
        street: '1',
        status: 'available',
        price: 2500000,
    },
    {
        id: '2',
        number: '2',
        size: '10',
        block: 'A',
        street: '1',
        status: 'sold',
        price: 2800000,
        owner: {
            name: 'Mr. Ahmad Khan',
            phone: '+92 300 1234567',
            email: 'ahmad@example.com'
        },
        bookingDate: '2024-01-15',
        totalPaid: 2800000,
        pendingAmount: 0
    },
    {
        id: '3',
        number: '3',
        size: '12',
        block: 'A',
        street: '1',
        status: 'reserved',
        price: 3200000,
        owner: {
            name: 'Ms. Fatima Ali',
            phone: '+92 321 7654321',
            email: 'fatima@example.com'
        },
        bookingDate: '2024-02-10',
        totalPaid: 1500000,
        pendingAmount: 1700000
    },
    {
        id: '4',
        number: '4',
        size: '10',
        block: 'A',
        street: '1',
        status: 'pending',
        price: 2600000,
        owner: {
            name: 'Mr. Usman Shah',
            phone: '+92 333 9876543',
            email: 'usman@example.com'
        },
        bookingDate: '2024-03-05',
        totalPaid: 500000,
        pendingAmount: 2100000
    },
    {
        id: '5',
        number: '5',
        size: '8',
        block: 'A',
        street: '2',
        status: 'available',
        price: 1800000,
    },
    {
        id: '6',
        number: '6',
        size: '10',
        block: 'A',
        street: '2',
        status: 'sold',
        price: 2200000,
        owner: {
            name: 'Mr. Imran Ali',
            phone: '+92 345 5556666',
            email: 'imran@example.com'
        },
        bookingDate: '2024-01-20',
        totalPaid: 2200000,
        pendingAmount: 0
    },
    {
        id: '7',
        number: '7',
        size: '10',
        block: 'A',
        street: '2',
        status: 'available',
        price: 2300000,
    },
    {
        id: '8',
        number: '8',
        size: '12',
        block: 'A',
        street: '2',
        status: 'reserved',
        price: 3000000,
        owner: {
            name: 'Dr. Sana Khan',
            phone: '+92 312 3334444',
            email: 'sana@example.com'
        },
        bookingDate: '2024-02-25',
        totalPaid: 1000000,
        pendingAmount: 2000000
    },
    {
        id: '9',
        number: '9',
        size: '10',
        block: 'B',
        street: '1',
        status: 'available',
        price: 2400000,
    },
    {
        id: '10',
        number: '10',
        size: '10',
        block: 'B',
        street: '1',
        status: 'sold',
        price: 2700000,
        owner: {
            name: 'Mr. Ali Raza',
            phone: '+92 312 7778888',
            email: 'ali@example.com'
        },
        bookingDate: '2024-03-10',
        totalPaid: 2700000,
        pendingAmount: 0
    },
    {
        id: '11',
        number: '11',
        size: '12',
        block: 'B',
        street: '2',
        status: 'available',
        price: 3100000,
    },
    {
        id: '12',
        number: '12',
        size: '8',
        block: 'B',
        street: '2',
        status: 'pending',
        price: 1900000,
        owner: {
            name: 'Ms. Ayesha Malik',
            phone: '+92 333 9990000',
            email: 'ayesha@example.com'
        },
        bookingDate: '2024-03-20',
        totalPaid: 300000,
        pendingAmount: 1600000
    },
];

const PropertiesMap: React.FC = () => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [selectedPlot, setSelectedPlot] = useState<Properties | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterBlock, setFilterBlock] = useState<string>('all');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    // Get unique blocks for filter
    const blocks = useMemo(() => {
        const uniqueBlocks = new Set(mockPlots.map(plot => plot.block));
        return ['all', ...Array.from(uniqueBlocks)];
    }, []);

    // Filter and search plots
    const filteredPlots = useMemo(() => {
        return mockPlots.filter(plot => {
            // Search filter
            const searchMatch =
                plot.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                plot.block.toLowerCase().includes(searchTerm.toLowerCase()) ||
                plot.owner?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                plot.owner?.phone?.includes(searchTerm);

            // Status filter
            const statusMatch = filterStatus === 'all' || plot.status === filterStatus;

            // Block filter
            const blockMatch = filterBlock === 'all' || plot.block === filterBlock;

            return searchMatch && statusMatch && blockMatch;
        });
    }, [searchTerm, filterStatus, filterBlock]);

    // ✅ Get status counts - now used in the filter buttons
    const statusCounts = useMemo(() => {
        const counts: Record<string, number> = { all: mockPlots.length };
        mockPlots.forEach(plot => {
            counts[plot.status] = (counts[plot.status] || 0) + 1;
        });
        return counts;
    }, []);

    const getStatusConfig = (status: Properties['status']) => {
        const configs = {
            available: {
                label: 'Available',
                icon: CheckCircle,
                className: 'bg-success/10 text-success border-success/20',
                dotColor: 'bg-success'
            },
            sold: {
                label: 'Sold',
                icon: XCircle,
                className: 'bg-neutral-500/10 text-neutral-500 border-neutral-500/20',
                dotColor: 'bg-neutral-500'
            },
            reserved: {
                label: 'Reserved',
                icon: ClockIcon,
                className: 'bg-warning/10 text-warning border-warning/20',
                dotColor: 'bg-warning'
            },
            pending: {
                label: 'Pending Payment',
                icon: AlertCircle,
                className: 'bg-danger/10 text-danger border-danger/20',
                dotColor: 'bg-danger'
            }
        };
        return configs[status];
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PK', {
            style: 'currency',
            currency: 'PKR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const getStatusColor = (status: Properties['status']) => {
        switch (status) {
            case 'available': return 'border-success/50 hover:border-success';
            case 'sold': return 'border-neutral-500/50 hover:border-neutral-500';
            case 'reserved': return 'border-warning/50 hover:border-warning';
            case 'pending': return 'border-danger/50 hover:border-danger';
            default: return 'border-border';
        }
    };

    // Status filter options with counts
    const statusOptions = [
        { value: 'all', label: 'All' },
        { value: 'available', label: 'Available' },
        { value: 'sold', label: 'Sold' },
        { value: 'reserved', label: 'Reserved' },
        { value: 'pending', label: 'Pending' },
    ];

    return (
        <div className="min-h-screen bg-background dark:bg-background">
            {/* Navigation Bar */}
            <nav className="sticky top-0 z-50 bg-surface dark:bg-surface-elevated border-b border-border dark:border-border backdrop-blur-sm">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="p-2 rounded-lg hover:bg-muted dark:hover:bg-surface-elevated transition-colors"
                                aria-label="Back to Dashboard"
                            >
                                <ArrowLeft size={20} className="text-muted-foreground" />
                            </button>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-linear-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                                    <Map size={18} className="text-white" />
                                </div>
                                <span className="text-lg font-bold text-foreground dark:text-white">
                                    Plot Map
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-lg hover:bg-muted dark:hover:bg-surface-elevated transition-colors"
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
                                    className="p-2 rounded-lg hover:bg-muted dark:hover:bg-surface-elevated transition-colors"
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
                    <h1 className="text-2xl font-bold text-foreground dark:text-white">
                        Available Plots
                    </h1>
                    <p className="text-muted-foreground dark:text-neutral-400 mt-1">
                        {filteredPlots.length} plots found
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search by plot number, block, owner name, or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-surface dark:bg-surface-elevated 
                            border border-border dark:border-border rounded-lg focus:ring-2 
                            focus:ring-primary/50 focus:border-primary outline-none transition
                            text-foreground dark:text-white placeholder:text-muted-foreground"
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-3">
                        {/* Status Filter */}
                        <div className="flex gap-2 flex-wrap">
                            {statusOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => setFilterStatus(option.value)}
                                    className={`
                                        px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                                        ${filterStatus === option.value
                                            ? 'bg-primary text-white'
                                            : 'bg-surface dark:bg-surface-elevated text-muted-foreground hover:text-foreground dark:hover:text-white border border-border dark:border-border'
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

                        {/* Block Filter */}
                        <select
                            value={filterBlock}
                            onChange={(e) => setFilterBlock(e.target.value)}
                            className="px-3 py-1.5 bg-surface dark:bg-surface-elevated border border-border dark:border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition text-foreground dark:text-white text-sm"
                        >
                            {blocks.map(block => (
                                <option key={block} value={block}>
                                    {block === 'all' ? 'All Blocks' : `Block ${block}`}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Plot Cards Grid */}
                {filteredPlots.length === 0 ? (
                    <div className="text-center py-12">
                        <Home size={48} className="mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium text-foreground dark:text-white">No plots found</h3>
                        <p className="text-muted-foreground">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredPlots.map((plot) => {
                            const statusConfig = getStatusConfig(plot.status);
                            const StatusIcon = statusConfig.icon;

                            return (
                                <div
                                    key={plot.id}
                                    onClick={() => setSelectedPlot(plot)}
                                    className={`
                                        cursor-pointer transition-all duration-200
                                        bg-surface dark:bg-surface-elevated 
                                        rounded-xl border-2 ${getStatusColor(plot.status)}
                                        hover:shadow-lg hover:scale-[1.02]
                                        p-4
                                    `}
                                >
                                    {/* Plot Number and Status */}
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="text-xl font-bold text-foreground dark:text-white">
                                                Plot #{plot.number}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                Block {plot.block} • Street {plot.street}
                                            </p>
                                        </div>
                                        <div className={`
                                            flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
                                            ${statusConfig.className}
                                        `}>
                                            <StatusIcon size={12} />
                                            {statusConfig.label}
                                        </div>
                                    </div>

                                    {/* Plot Details */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Size</span>
                                            <span className="font-medium text-foreground dark:text-white">
                                                {plot.size} Marla
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Price</span>
                                            <span className="font-semibold text-primary">
                                                {formatCurrency(plot.price)}
                                            </span>
                                        </div>
                                        {plot.owner && (
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">Owner</span>
                                                <span className="font-medium text-foreground dark:text-white truncate max-w-30">
                                                    {plot.owner.name}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Status Dot Indicator */}
                                    <div className="mt-3 flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${statusConfig.dotColor} animate-pulse`} />
                                        <span className="text-xs text-muted-foreground">
                                            Click for details
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            {/* Plot Details Modal */}
            {selectedPlot && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <Card className="w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto">
                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedPlot(null)}
                            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted transition-colors"
                            aria-label="Close modal"
                        >
                            <X size={20} className="text-muted-foreground" />
                        </button>

                        {/* Plot Header */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-2xl font-bold text-foreground dark:text-white">
                                    Plot #{selectedPlot.number}
                                </h2>
                                <span className={`
                                    px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5
                                    ${getStatusConfig(selectedPlot.status).className}
                                `}>
                                    {React.createElement(getStatusConfig(selectedPlot.status).icon, { size: 14 })}
                                    {getStatusConfig(selectedPlot.status).label}
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Block {selectedPlot.block} • Street {selectedPlot.street}
                            </p>
                        </div>

                        {/* Plot Details Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="p-3 bg-surface dark:bg-surface-elevated rounded-lg">
                                <p className="text-xs text-muted-foreground">Size</p>
                                <p className="font-semibold text-foreground dark:text-white">
                                    {selectedPlot.size} Marla
                                </p>
                            </div>
                            <div className="p-3 bg-surface dark:bg-surface-elevated rounded-lg">
                                <p className="text-xs text-muted-foreground">Price</p>
                                <p className="font-semibold text-foreground dark:text-white">
                                    {formatCurrency(selectedPlot.price)}
                                </p>
                            </div>
                        </div>

                        {/* Owner Information */}
                        {selectedPlot.owner ? (
                            <div className="mb-6 p-4 bg-primary/5 dark:bg-primary/10 rounded-lg border border-primary/10">
                                <h3 className="text-sm font-semibold text-foreground dark:text-white mb-3 flex items-center gap-2">
                                    <User size={16} />
                                    Owner Information
                                </h3>
                                <div className="space-y-2">
                                    <p className="text-sm">
                                        <span className="text-muted-foreground">Name:</span>{' '}
                                        <span className="font-medium">{selectedPlot.owner.name}</span>
                                    </p>
                                    <p className="text-sm">
                                        <span className="text-muted-foreground">Phone:</span>{' '}
                                        <span className="font-medium">{selectedPlot.owner.phone}</span>
                                    </p>
                                    <p className="text-sm">
                                        <span className="text-muted-foreground">Email:</span>{' '}
                                        <span className="font-medium">{selectedPlot.owner.email}</span>
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="mb-6 p-4 bg-success/5 rounded-lg border border-success/10 text-center">
                                <CheckCircle size={24} className="mx-auto text-success mb-2" />
                                <p className="text-sm text-muted-foreground">This plot is available for sale</p>
                            </div>
                        )}

                        {/* Payment Information */}
                        {selectedPlot.owner && (
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-foreground dark:text-white mb-3">
                                    Payment Details
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 bg-success/5 rounded-lg border border-success/10">
                                        <p className="text-xs text-muted-foreground">Total Paid</p>
                                        <p className="font-semibold text-success">
                                            {formatCurrency(selectedPlot.totalPaid || 0)}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-danger/5 rounded-lg border border-danger/10">
                                        <p className="text-xs text-muted-foreground">Pending</p>
                                        <p className="font-semibold text-danger">
                                            {formatCurrency(selectedPlot.pendingAmount || 0)}
                                        </p>
                                    </div>
                                </div>
                                {selectedPlot.bookingDate && (
                                    <p className="mt-2 text-xs text-muted-foreground">
                                        Booked on: {new Date(selectedPlot.bookingDate).toLocaleDateString('en-PK', {
                                            day: '2-digit',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <Button
                                className="flex-1"
                                onClick={() => {
                                    navigate(`/plot-detail/${selectedPlot.id}`);
                                    console.log('View full details for plot', selectedPlot.id);
                                    setSelectedPlot(null);
                                }}
                            >
                                View Full Details
                            </Button>
                            {selectedPlot.status === 'available' && (
                                <Button
                                    variant="secondary"
                                    className="flex-1"
                                    onClick={() => {
                                        console.log('Book plot', selectedPlot.id);
                                        setSelectedPlot(null);
                                    }}
                                >
                                    Book Plot
                                </Button>
                            )}
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default PropertiesMap;