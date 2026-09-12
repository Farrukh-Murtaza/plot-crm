import React, { useState } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { CNICTextField, PhoneTextField, Select, Textarea, TextField } from '../components/ui';
import type { EditOwnerFormData, OwnerDetail } from '../types';



interface EditOwnerFormProps {
    initialData: OwnerDetail;
    onSave: (data: OwnerDetail) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

const TITLES = ['Mr.', 'Mrs.', 'Ms.', 'Miss', 'Dr.', 'Prof.'];
const RELATIONS = ['S/O', 'D/O', 'W/O', 'H/O', 'B/O'];
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
];

export const EditOwnerForm: React.FC<EditOwnerFormProps> = ({
    initialData,
    onSave,
    onCancel,
    isLoading = false,
}) => {
    const [formData, setFormData] = useState<EditOwnerFormData>(initialData);
    const [showNominee, setShowNominee] = useState(!!initialData.nominee);
    const [customOccupation, setCustomOccupation] = useState(
        initialData.customOccupation || ''
    );

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const finalData: OwnerDetail = {
            ...formData,
            title: formData.title as OwnerDetail['title'],
            relation: formData.relation as OwnerDetail['relation'],
            occupation: formData.occupation as OwnerDetail['occupation'],
            customOccupation: formData.occupation === 'Other' ? customOccupation : '',
            nominee: formData.nominee
                ? {
                    ...formData.nominee,
                    title: formData.nominee.title as OwnerDetail['title'],
                    relation: formData.nominee.relation as OwnerDetail['relation'],
                }
                : null,
        };

        onSave(finalData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="border-b border-border pb-6.25">
                <h3 className="text-md font-semibold text-foreground dark:text-white mb-4">
                    Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <Select
                        label='Title'
                        name="title"
                        value={formData.title}
                        options={TITLES.map(title => ({ value: title, label: title }))}
                        required
                        onChange={handleChange} />

                    <TextField
                        name="name"
                        label='Full Name'
                        value={formData.name}
                        onChange={handleChange}
                        type="text"
                        required
                    />

                    <Select
                        label='Relation'
                        name="relation"
                        value={formData.relation}
                        options={RELATIONS.map(relation => ({ value: relation, label: relation }))}
                        required
                        onChange={handleChange} />

                    <TextField
                        name='relationName'
                        label={`${formData.relation} Name`}
                        value={formData.relationName || ''}
                        onChange={handleChange}
                        placeholder={`Enter ${formData.relation} name`}
                    />

                </div>
            </div>

            {/* Contact Information */}
            <div className="border-b border-border pb-6.5">

                <h3 className="text-md font-semibold text-foreground dark:text-white mb-4">
                    Contact Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <TextField
                        type='email'
                        label='Email'
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="owner@example.com"
                        required
                    />

                    <CNICTextField
                        label='CNIC'
                        name="cnic"
                        value={formData.cnic}
                        onChange={handlePhoneChange}
                        required
                    />

                    <PhoneTextField
                        label='Mobile Number'
                        name="phone"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        required
                    />

                    <PhoneTextField
                        label='WhatsApp Number'
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handlePhoneChange}
                        required
                    />

                </div>
            </div>

            {/* Occupation & Address */}
            <div className="border-b border-border pb-6.5">
                <h3 className="text-md font-semibold text-foreground dark:text-white mb-4">
                    Occupation & Address
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <Select
                        label='Occupation'
                        name="occupation"
                        value={formData.occupation}
                        onChange={handleChange}
                        options={OCCUPATIONS.map(occupation => ({ label: occupation, value: occupation }))}
                    />


                    {formData.occupation === 'Other' && (
                        <div>
                            <TextField
                                label='CustomOccupation'
                                name='customOccupation'
                                value={customOccupation}
                                onChange={(e) => setCustomOccupation(e.target.value)}
                                placeholder="Enter occupation"
                                required
                            />
                        </div>
                    )}
                    <div className="md:col-span-2">
                        <Textarea
                            label="Address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            rows={2}
                            placeholder="Enter complete address"
                            required
                        />
                    </div>
                </div>
            </div>

            {/* Nominee */}
            <div className=" pb-6.5">
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

                            <Select
                                label='Title'
                                name="nomineeTitle"
                                value={formData.nominee.title}
                                options={TITLES.map(title => ({ value: title, label: title }))}
                                required
                                onChange={handleNomineeChange} />

                            <TextField
                                label='Nominee Full Name'
                                name="nomineeName"
                                value={formData.nominee.name}
                                onChange={handleNomineeChange}
                                placeholder="Enter nominee name"
                                required
                            />

                            <Select
                                label='Relation'
                                name="nomineeRelation"
                                value={formData.nominee.relation}
                                options={RELATIONS.map(relation => ({ value: relation, label: relation }))}
                                required
                                onChange={handleChange} />

                            <TextField
                                name='Relation with Nominee'
                                label={`${formData.nominee.relation} Name`}
                                value={formData.nominee.relation || ''}
                                onChange={handleChange}
                                placeholder={`Enter ${formData.nominee.relation} name`}
                            />


                            <CNICTextField
                                label='Nominee CNIC'
                                name="nomineeCnic"
                                value={formData.nominee.cnic}
                                onChange={handleNomineeChange}
                                required
                            />

                            <PhoneTextField
                                name='nomineePhone'
                                label='Nominee Phone'
                                value={formData.nominee.phone}
                                onChange={handleNomineeChange}
                                required
                            />

                            <TextField
                                label='Nominee Email'
                                name="nomineeEmail"
                                value={formData.nominee.email || ''}
                                onChange={handleNomineeChange}
                                placeholder="nominee@example.com"
                                type='email' />

                            {/* Join Date */}
                            <TextField
                                label='Join Date'
                                type="date"
                                name="joinDate"
                                value={formData.joinDate || ''}
                                onChange={handleChange}
                            />

                        </div>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 ">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                    className="flex-1"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    loading={isLoading}
                    className="flex-1"
                >
                    <Save size={18} className="mr-2" />
                    Save Owner
                </Button>
            </div>
        </form >
    );
};