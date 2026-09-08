import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface PlotData {
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

interface EditPlotModalProps {
    isOpen: boolean;
    onClose: () => void;
    plotData: PlotData;
    onSave: (data: PlotData) => void;
}

export const EditPlotModal: React.FC<EditPlotModalProps> = ({
    isOpen,
    onClose,
    plotData,
    onSave
}) => {
    const [formData, setFormData] = useState<PlotData>(plotData);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            onSave(formData);
            onClose();
        } catch (error) {
            console.error('Error saving plot:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox'
                ? (e.target as HTMLInputElement).checked
                : type === 'number'
                    ? parseFloat(value)
                    : value
        }));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <Card className="w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted transition-colors"
                >
                    <X size={20} className="text-muted-foreground" />
                </button>

                <h2 className="text-2xl font-bold text-foreground dark:text-white mb-6">
                    Edit Plot Details
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground dark:text-white mb-1">
                                Plot Number
                            </label>
                            <input
                                type="text"
                                name="number"
                                value={formData.number}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-surface dark:bg-surface-elevated border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground dark:text-white mb-1">
                                Size (Marla)
                            </label>
                            <input
                                type="number"
                                name="size"
                                value={formData.size}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-surface dark:bg-surface-elevated border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground dark:text-white mb-1">
                                Block
                            </label>
                            <input
                                type="text"
                                name="block"
                                value={formData.block}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-surface dark:bg-surface-elevated border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground dark:text-white mb-1">
                                Street
                            </label>
                            <input
                                type="text"
                                name="street"
                                value={formData.street}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-surface dark:bg-surface-elevated border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground dark:text-white mb-1">
                                Sector
                            </label>
                            <input
                                type="text"
                                name="sector"
                                value={formData.sector}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-surface dark:bg-surface-elevated border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground dark:text-white mb-1">
                                Price (PKR)
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-surface dark:bg-surface-elevated border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground dark:text-white mb-1">
                                Rate per Marla
                            </label>
                            <input
                                type="number"
                                name="ratePerMarla"
                                value={formData.ratePerMarla}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-surface dark:bg-surface-elevated border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground dark:text-white mb-1">
                                Park Face (%)
                            </label>
                            <input
                                type="number"
                                name="parkFace"
                                value={formData.parkFace}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-surface dark:bg-surface-elevated border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="corner"
                            checked={formData.corner}
                            onChange={handleChange}
                            className="w-4 h-4 text-primary border-border rounded focus:ring-2 focus:ring-primary"
                        />
                        <label className="text-sm font-medium text-foreground dark:text-white">
                            Corner Plot
                        </label>
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
                            <Save size={18} className="mr-2" />
                            Save Changes
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};