import React, { forwardRef, useCallback } from 'react';
import { Phone } from 'lucide-react';

interface PhoneTextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    icon?: React.ElementType;
}

export const PhoneTextField = forwardRef<HTMLInputElement, PhoneTextFieldProps>(({
    label,
    error,
    helperText,
    value,
    onChange,
    icon: Icon = Phone,
    className = '',
    id,
    placeholder = '+92 300 1234567',
    ...props
}, ref) => {
    const inputId = id || props.name || 'phone-field';

    // Format phone number as user types
    const formatPhoneNumber = useCallback((inputValue: string): string => {
        // Remove all non-digit characters
        const digits = inputValue.replace(/\D/g, '');

        // If empty, return empty string
        if (digits.length === 0) return '';

        let formatted = '';

        // Check if it starts with country code (92)
        if (digits.startsWith('92')) {
            // Format: +92 3XX-XXXXXXX
            if (digits.length <= 2) {
                formatted = '+' + digits;
            } else if (digits.length <= 5) {
                formatted = '+' + digits.slice(0, 2) + ' ' + digits.slice(2);
            } else if (digits.length <= 9) {
                formatted = '+' + digits.slice(0, 2) + ' ' + digits.slice(2, 5) + '-' + digits.slice(5);
            } else {
                formatted = '+' + digits.slice(0, 2) + ' ' + digits.slice(2, 5) + '-' + digits.slice(5, 12);
            }
        } else {
            // Local format: xxxx-xxxxxxx
            if (digits.length <= 4) {
                formatted = digits;
            } else if (digits.length <= 11) {
                formatted = digits.slice(0, 4) + '-' + digits.slice(4);
            } else {
                formatted = digits.slice(0, 4) + '-' + digits.slice(4, 11);
            }
        }

        return formatted;
    }, []);

    // Handle change with proper event propagation
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        const formatted = formatPhoneNumber(rawValue);

        // Create a synthetic event with the formatted value
        const syntheticEvent = {
            ...e,
            target: {
                ...e.target,
                value: formatted,
                name: e.target.name,
                id: e.target.id,
            }
        } as React.ChangeEvent<HTMLInputElement>;

        // Call the parent onChange with the formatted value
        onChange(syntheticEvent);
    }, [formatPhoneNumber, onChange]);

    // Validate phone number
    const validatePhone = useCallback((phone: string): string => {
        const digits = phone.replace(/\D/g, '');

        if (digits.length === 0) return '';

        // Check for valid Pakistan number formats
        if (digits.startsWith('92') && digits.length === 12) {
            return '';
        }

        // Local format: xxxx-xxxxxxx
        if (digits.length === 11 && !digits.startsWith('92')) {
            return '';
        }

        // Format with 0: 03XX-XXXXXXX
        if (digits.startsWith('0') && digits.length === 12) {
            return '';
        }

        // Partial validation
        if (digits.length > 0 && digits.length < 10) {
            return 'Phone number is incomplete';
        }

        if (digits.length === 10) {
            return 'Please enter complete phone number (e.g., 0300-1234567)';
        }

        if (digits.length > 0 && digits.length < 11) {
            return 'Phone number is incomplete';
        }

        return 'Please enter a valid phone number';
    }, []);

    const validationError = value ? validatePhone(value) : '';

    return (
        <div className="space-y-1.5">
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-foreground mb-1"
                >
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon className="w-5 h-5 text-muted-foreground dark:text-neutral-500" />
                    </div>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    type="tel"
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className={`
                        w-full 
                        ${Icon ? 'pl-10' : 'px-4'} 
                        pr-16 py-2 
                        bg-surface dark:bg-surface-elevated
                        border-2 
                        ${error || validationError ? 'border-danger dark:border-danger' : 'border-border dark:border-border'}
                        rounded-xl 
                        focus:ring-2 focus:ring-primary/50 focus:border-primary 
                        outline-none transition
                        placeholder:text-muted-foreground dark:placeholder:text-neutral-500
                        text-foreground 
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${className}
                    `}
                    aria-invalid={!!(error || validationError)}
                    aria-describedby={error || validationError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
                    {...props}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-xs text-muted-foreground dark:text-neutral-500">
                        {value ? value.replace(/\D/g, '').length : 0}/12
                    </span>
                </div>
            </div>
            {(error || validationError) && (
                <p id={`${inputId}-error`} className="text-sm text-danger dark:text-danger">
                    {error || validationError}
                </p>
            )}
            {helperText && !error && !validationError && (
                <p id={`${inputId}-helper`} className="text-sm text-muted-foreground dark:text-neutral-500">
                    {helperText}
                </p>
            )}
            <p className="text-xs text-muted-foreground dark:text-neutral-500">
                Format: xxxx-xxxxxxx
            </p>
        </div>
    );
});

PhoneTextField.displayName = 'PhoneTextField';