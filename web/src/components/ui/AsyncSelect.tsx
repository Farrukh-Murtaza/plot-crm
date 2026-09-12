import React, { useState, useEffect, useCallback, forwardRef } from 'react';
import { ChevronDown, Check, Search, X, Loader2 } from 'lucide-react';

interface AsyncSelectOption {
    value: string;
    label: string;
}

interface AsyncSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
    label?: string;
    error?: string;
    helperText?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    placeholder?: string;
    icon?: React.ElementType;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    loadOptions: (searchTerm: string) => Promise<AsyncSelectOption[]>;
    debounceDelay?: number;
    minSearchLength?: number;
    initialOptions?: AsyncSelectOption[];
}

export const AsyncSelect = forwardRef<HTMLSelectElement, AsyncSelectProps>(({
    label,
    error,
    helperText,
    value,
    onChange,
    placeholder = 'Search and select...',
    icon: Icon,
    required = false,
    disabled = false,
    className = '',
    id,
    name,
    loadOptions,
    debounceDelay = 300,
    minSearchLength = 2,
    initialOptions = [],
    ...props
}, ref) => {
    const inputId = id || name || 'async-select-field';
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [options, setOptions] = useState<AsyncSelectOption[]>(initialOptions);
    const [loading, setLoading] = useState(false);
    const [selectedLabel, setSelectedLabel] = useState('');

    // Load options
    const fetchOptions = useCallback(async (search: string) => {
        if (search.length < minSearchLength) {
            setOptions(initialOptions);
            return;
        }

        setLoading(true);
        try {
            const results = await loadOptions(search);
            setOptions(results);
        } catch (error) {
            console.error('Error loading options:', error);
            setOptions([]);
        } finally {
            setLoading(false);
        }
    }, [loadOptions, initialOptions, minSearchLength]);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchOptions(searchTerm);
        }, debounceDelay);

        return () => clearTimeout(timer);
    }, [searchTerm, fetchOptions, debounceDelay]);

    // Update selected label when value changes
    useEffect(() => {
        const selected = options.find(opt => opt.value === value);
        setSelectedLabel(selected?.label || '');
    }, [value, options]);

    const handleSelect = (option: AsyncSelectOption) => {
        const syntheticEvent = {
            target: {
                value: option.value,
                name: name || '',
                id: inputId,
            }
        } as React.ChangeEvent<HTMLSelectElement>;

        onChange(syntheticEvent);
        setSearchTerm('');
        setIsOpen(false);
    };

    const handleClear = () => {
        const syntheticEvent = {
            target: {
                value: '',
                name: name || '',
                id: inputId,
            }
        } as React.ChangeEvent<HTMLSelectElement>;

        onChange(syntheticEvent);
        setSearchTerm('');
    };

    const validationError = error || (required && !value ? 'This field is required' : '');

    return (
        <div className="space-y-1.5">
            {/* Label */}
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-foreground mb-1"
                >
                    {label}
                    {required && <span className="text-red-500 dark:text-red-400 ml-1">*</span>}
                </label>
            )}

            {/* Select Wrapper */}
            <div className="relative">
                {/* Icon */}
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                        <Icon className="w-5 h-5 text-gray-400 dark:text-neutral-500" />
                    </div>
                )}

                {/* Trigger Button */}
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    disabled={disabled}
                    className={`
                        w-full 
                        ${Icon ? 'pl-10' : 'px-4'} 
                        pr-10 py-3 
                        bg-white dark:bg-surface-elevated
                        border-2 
                        ${validationError ? 'border-red-500 dark:border-red-500' : 'border-gray-200 dark:border-border'}
                        rounded-xl 
                        focus:ring-2 focus:ring-primary/50 focus:border-primary 
                        outline-none transition
                        text-left
                        text-gray-900 
                        disabled:opacity-50 disabled:cursor-not-allowed
                        flex items-center justify-between
                        ${className}
                    `}
                    aria-invalid={!!validationError}
                >
                    <span className={selectedLabel ? 'text-gray-900 ' : 'text-gray-400 dark:text-neutral-500'}>
                        {selectedLabel || placeholder}
                    </span>
                    {value && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleClear();
                            }}
                            className="p-0.5 hover:bg-gray-100 dark:hover:bg-surface-elevated rounded-full transition"
                        >
                            <X className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:text-neutral-500" />
                        </button>
                    )}
                    <ChevronDown className={`w-5 h-5 text-gray-400 dark:text-neutral-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown */}
                {isOpen && !disabled && (
                    <div className="absolute z-50 w-full mt-2 bg-white dark:bg-surface-elevated border border-gray-200 dark:border-border rounded-xl shadow-lg overflow-hidden">
                        {/* Search Input */}
                        <div className="p-2 border-b border-gray-200 dark:border-border">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-neutral-500" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search..."
                                    className="w-full pl-9 pr-3 py-1.5 bg-gray-50 dark:bg-background border border-gray-200 dark:border-border rounded-lg text-sm text-gray-900  focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition"
                                    autoFocus
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        </div>

                        {/* Options List */}
                        <div className="max-h-60 overflow-y-auto">
                            {loading ? (
                                <div className="flex items-center justify-center p-4">
                                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                    <span className="ml-2 text-sm text-gray-500 dark:text-neutral-400">Loading...</span>
                                </div>
                            ) : options.length === 0 ? (
                                <div className="p-4 text-sm text-gray-500 dark:text-neutral-400 text-center">
                                    No options found
                                </div>
                            ) : (
                                options.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => handleSelect(option)}
                                        className={`
                                            w-full px-4 py-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-background transition
                                            flex items-center justify-between
                                            ${value === option.value ? 'bg-primary/10 dark:bg-primary/20' : ''}
                                        `}
                                    >
                                        <span className="text-gray-900 ">
                                            {option.label}
                                        </span>
                                        {value === option.value && (
                                            <Check className="w-4 h-4 text-primary" />
                                        )}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Error Message */}
            {validationError && (
                <p id={`${inputId}-error`} className="text-sm text-red-500 dark:text-red-400">
                    {validationError}
                </p>
            )}

            {/* Helper Text */}
            {helperText && !validationError && (
                <p id={`${inputId}-helper`} className="text-sm text-gray-500 dark:text-neutral-400">
                    {helperText}
                </p>
            )}
        </div>
    );
});

AsyncSelect.displayName = 'AsyncSelect';