import React, { useState } from 'react';
import { X, Save, User, Plus, Trash2, Mail, MapPin } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { PhoneTextField } from '../ui/PhoneTextField';
import { CNICTextField } from '../ui/CNICTextField';
import type {
    Title,
    Relation,
    OwnerDetail
    // ✅ Removed unused 'Nominee' import
} from '../../types';

// Static data
const TITLES: Title[] = ['Mr.', 'Mrs.', 'Ms.', 'Miss', 'Dr.', 'Prof.'];
const RELATIONS: Relation[] = ['S/O', 'D/O', 'W/O', 'H/O', 'B/O'];
const OCCUPATIONS = [
    'Business Owner',
    'Salaried Professional',
    'Government Employee',
    'Private Employee',
    'Self Employed',
    'Student',
    'Retired',
    'Housewife',
    'Farmer',
    'Doctor',
    'Engineer',
    'Teacher',
    'Lawyer',
    'Architect',
    'Real Estate Agent',
    'Other'
] as const;

interface EditOwnerModalProps {
    isOpen: boolean;
    onClose: () => void;
    ownerData: OwnerDetail;
    onSave: (data: OwnerDetail) => void;
}

export const EditOwnerModal: React.FC<EditOwnerModalProps> = ({
    isOpen,
    onClose,
    ownerData,
    onSave
}) => {
    // Initialize state directly from props
    const [formData, setFormData] = useState<OwnerDetail>(() => ({
        id: ownerData.id || '',
        title: ownerData.title || 'Mr.',
        name: ownerData.name || '',
        relation: ownerData.relation || 'S/O',
        relationName: ownerData.relationName || '',
        cnic: ownerData.cnic || '',
        phone: ownerData.phone || '',
        whatsapp: ownerData.whatsapp || '',
        email: ownerData.email || '',
        occupation: ownerData.occupation || 'Business Owner',
        customOccupation: ownerData.customOccupation || '',
        address: ownerData.address || '',
        city: ownerData.city || '',
        country: ownerData.country || '',
        postalCode: ownerData.postalCode || '',
        nominee: ownerData.nominee || null,
        joinDate: ownerData.joinDate || ''
    }));

    const [loading, setLoading] = useState(false);
    const [showNominee, setShowNominee] = useState(!!ownerData.nominee);
    const [customOccupation, setCustomOccupation] = useState(
        ownerData.customOccupation || ''
    );

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const finalData = {
                ...formData,
                occupation: formData.occupation === 'Other' ? customOccupation : formData.occupation,
                customOccupation: formData.occupation === 'Other' ? customOccupation : ''
            };

            onSave(finalData);
            onClose();
        } catch (error) {
            console.error('Error saving owner:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleNomineeChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            nominee: prev.nominee ? {
                ...prev.nominee,
                [name]: name === 'percentage' ? parseFloat(value) : value
            } : null
        }));
    };

    const handleAddNominee = () => {
        setFormData(prev => ({
            ...prev,
            nominee: {
                name: '',
                title: 'Mr.',
                relation: 'S/O',
                cnic: '',
                phone: '',
                email: '',
                percentage: 100
            }
        }));
        setShowNominee(true);
    };

    const handleRemoveNominee = () => {
        setFormData(prev => ({
            ...prev,
            nominee: null
        }));
        setShowNominee(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <Card className="w-full max-w-4xl p-6 relative max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted transition-colors"
                >
                    <X size={20} className="text-muted-foreground" />
                </button>

                <h2 className="text-2xl font-bold text-foreground dark:text-white mb-6 flex items-center gap-2">
                    <User size={24} className="text-primary" />
                    Edit Owner Information
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information Section */}
                    <div className="border-b border-border pb-4">
                        <h3 className="text-sm font-semibold text-foreground dark:text-white mb-4">
                            Basic Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground dark:text-white mb-1">
                                    Title *
                                </label>
                                <select
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 bg-surface dark:bg-surface-elevated border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                                    required
                                >
                                    {TITLES.map(title => (
                                        <option key={title} value={title}>{title}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground dark:text-white mb-1">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter full name"
                                    className="w-full px-3 py-2 bg-surface dark:bg-surface-elevated border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground dark:text-white mb-1">
                                    Relation *
                                </label>
                                <select
                                    name="relation"
                                    value={formData.relation}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 bg-surface dark:bg-surface-elevated border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                                    required
                                >
                                    {RELATIONS.map(relation => (
                                        <option key={relation} value={relation}>{relation}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground dark:text-white mb-1">
                                    {formData.relation} Name *
                                </label>
                                <input
                                    type="text"
                                    name="relationName"
                                    value={formData.relationName || ''}
                                    onChange={handleChange}
                                    placeholder={`Enter ${formData.relation} name`}
                                    className="w-full px-3 py-2 bg-surface dark:bg-surface-elevated border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact Information Section */}
                    <div className="border-b border-border pb-4">
                        <h3 className="text-sm font-semibold text-foreground dark:text-white mb-4">
                            Contact Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <CNICTextField
                                label="CNIC *"
                                name="cnic"
                                value={formData.cnic}
                                onChange={handlePhoneChange}
                                placeholder="12345-6789012-3"
                                required
                            />

                            <PhoneTextField
                                label="Mobile Number *"
                                name="phone"
                                value={formData.phone}
                                onChange={handlePhoneChange}
                                placeholder="+92 300 1234567"
                                required
                            />

                            <PhoneTextField
                                label="WhatsApp Number"
                                name="whatsapp"
                                value={formData.whatsapp || ''}
                                onChange={handlePhoneChange}
                                placeholder="+92 300 1234567"
                                helperText="Used for mobile verification and OTP"
                            />

                            <div>
                                <label className="block text-sm font-medium text-foreground dark:text-white mb-1">
                                    Email *
                                </label>
                                <div className="relative">
                                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="owner@example.com"
                                        className="w-full pl-10 pr-3 py-2 bg-surface dark:bg-surface-elevated border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Occupation & Address Section */}
                    <div className="border-b border-border pb-4">
                        <h3 className="text-sm font-semibold text-foreground dark:text-white mb-4">
                            Occupation & Address
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground dark:text-white mb-1">
                                    Occupation *
                                </label>
                                <select
                                    name="occupation"
                                    value={formData.occupation}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 bg-surface dark:bg-surface-elevated border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                                    required
                                >
                                    {OCCUPATIONS.map(occ => (
                                        <option key={occ} value={occ}>{occ}</option>
                                    ))}
                                </select>
                            </div>

                            {formData.occupation === 'Other' && (
                                <div>
                                    <label className="block text-sm font-medium text-foreground dark:text-white mb-1">
                                        Specify Occupation *
                                    </label>
                                    <input
                                        type="text"
                                        value={customOccupation}
                                        onChange={(e) => setCustomOccupation(e.target.value)}
                                        placeholder="Enter occupation"
                                        className="w-full px-3 py-2 bg-surface dark:bg-surface-elevated border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                                        required
                                    />
                                </div>
                            )}

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-foreground dark:text-white mb-1">
                                    Address *
                                </label>
                                <div className="relative">
                                    <MapPin size={16} className="absolute left-3 top-3 text-muted-foreground" />
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        rows={2}
                                        placeholder="Enter complete address"
                                        className="w-full pl-10 pr-3 py-2 bg-surface dark:bg-surface-elevated border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground dark:text-white mb-1">
                                    City
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city || ''}
                                    onChange={handleChange}
                                    placeholder="City"
                                    className="w-full px-3 py-2 bg-surface dark:bg-surface-elevated border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground dark:text-white mb-1">
                                    Postal Code
                                </label>
                                <input
                                    type="text"
                                    name="postalCode"
                                    value={formData.postalCode || ''}
                                    onChange={handleChange}
                                    placeholder="Postal code"
                                    className="w-full px-3 py-2 bg-surface dark:bg-surface-elevated border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Nominee Section */}
                    <div className="border-b border-border pb-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-foreground dark:text-white">
                                Nominee Information
                            </h3>
                            {!showNominee ? (
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={handleAddNominee}
                                    className="flex items-center gap-1"
                                >
                                    <Plus size={14} />
                                    Add Nominee
                                </Button>
                            ) : (
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={handleRemoveNominee}
                                    className="flex items-center gap-1 text-danger hover:text-danger"
                                >
                                    <Trash2 size={14} />
                                    Remove Nominee
                                </Button>
                            )}
                        </div>

                        {showNominee && formData.nominee && (
                            <div className="p-4 bg-surface dark:bg-surface-elevated rounded-lg border border-border">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-foreground dark:text-white mb-1">
                                            Nominee Title *
                                        </label>
                                        <select
                                            name="title"
                                            value={formData.nominee.title}
                                            onChange={handleNomineeChange}
                                            className="w-full px-3 py-2 bg-background dark:bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                                            required
                                        >
                                            {TITLES.map(title => (
                                                <option key={title} value={title}>{title}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground dark:text-white mb-1">
                                            Nominee Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.nominee.name}
                                            onChange={handleNomineeChange}
                                            placeholder="Enter nominee name"
                                            className="w-full px-3 py-2 bg-background dark:bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground dark:text-white mb-1">
                                            Relation with Nominee *
                                        </label>
                                        <select
                                            name="relation"
                                            value={formData.nominee.relation}
                                            onChange={handleNomineeChange}
                                            className="w-full px-3 py-2 bg-background dark:bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                                            required
                                        >
                                            {RELATIONS.map(relation => (
                                                <option key={relation} value={relation}>{relation}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground dark:text-white mb-1">
                                            Nominee CNIC *
                                        </label>
                                        <input
                                            type="text"
                                            name="cnic"
                                            value={formData.nominee.cnic}
                                            onChange={handleNomineeChange}
                                            placeholder="12345-6789012-3"
                                            className="w-full px-3 py-2 bg-background dark:bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground dark:text-white mb-1">
                                            Nominee Phone *
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.nominee.phone}
                                            onChange={handleNomineeChange}
                                            placeholder="+92 300 1234567"
                                            className="w-full px-3 py-2 bg-background dark:bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground dark:text-white mb-1">
                                            Nominee Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.nominee.email || ''}
                                            onChange={handleNomineeChange}
                                            placeholder="nominee@example.com"
                                            className="w-full px-3 py-2 bg-background dark:bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground dark:text-white mb-1">
                                            Share Percentage (%)
                                        </label>
                                        <input
                                            type="number"
                                            name="percentage"
                                            value={formData.nominee.percentage || 100}
                                            onChange={handleNomineeChange}
                                            min="0"
                                            max="100"
                                            className="w-full px-3 py-2 bg-background dark:bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                                        />
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            Default: 100%
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Join Date */}
                    <div>
                        <label className="block text-sm font-medium text-foreground dark:text-white mb-1">
                            Join Date
                        </label>
                        <input
                            type="date"
                            name="joinDate"
                            value={formData.joinDate || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-surface dark:bg-surface-elevated border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                        />
                    </div>

                    {/* Action Buttons */}
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
                            Save Owner
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};