import React, { forwardRef, useCallback } from 'react';
import { FileText } from 'lucide-react';

interface CNICTextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    icon?: React.ElementType;
}

export const CNICTextField = forwardRef<HTMLInputElement, CNICTextFieldProps>(({
    label,
    error,
    helperText,
    value,
    onChange,
    icon: Icon = FileText,
    className = '',
    id,
    placeholder = '12345-6789012-3',
    ...props
}, ref) => {
    const inputId = id || props.name || 'cnic-field';

    // Format CNIC as user types
    const formatCNIC = useCallback((inputValue: string): string => {
        // Remove all non-digit characters
        const digits = inputValue.replace(/\D/g, '');

        // If empty, return empty string
        if (digits.length === 0) return '';

        // Format: xxxxx-xxxxxxx-x
        let formatted = '';
        if (digits.length <= 5) {
            formatted = digits;
        } else if (digits.length <= 12) {
            formatted = digits.slice(0, 5) + '-' + digits.slice(5);
        } else if (digits.length <= 13) {
            formatted = digits.slice(0, 5) + '-' + digits.slice(5, 12) + '-' + digits.slice(12);
        } else {
            formatted = digits.slice(0, 5) + '-' + digits.slice(5, 12) + '-' + digits.slice(12, 13);
        }

        return formatted;
    }, []);

    // Handle change with proper event propagation
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        const formatted = formatCNIC(rawValue);

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
    }, [formatCNIC, onChange]);

    // Validate CNIC
    const validateCNIC = useCallback((cnic: string): string => {
        const digits = cnic.replace(/\D/g, '');

        if (digits.length === 0) return '';

        // Check if CNIC has exactly 13 digits
        if (digits.length === 13) {
            // Validate format: 5-7-1 (total 13 digits)
            const part1 = digits.slice(0, 5);
            const part2 = digits.slice(5, 12);
            const part3 = digits.slice(12, 13);

            // Check if parts are valid
            if (part1.length === 5 && part2.length === 7 && part3.length === 1) {
                return '';
            }
            return 'Invalid CNIC format';
        }

        if (digits.length > 0 && digits.length < 13) {
            return `CNIC is incomplete (${digits.length}/13 digits)`;
        }

        if (digits.length > 13) {
            return 'CNIC cannot exceed 13 digits';
        }

        return 'Please enter a valid CNIC';
    }, []);

    const validationError = value ? validateCNIC(value) : '';

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
                    type="text"
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className={`
                        w-full 
                        ${Icon ? 'pl-10' : 'px-3'} 
                        pr-16 py-2 
                        bg-surface dark:bg-surface-elevated
                        border-2 
                        ${error || validationError ? 'border-danger dark:border-danger' : 'border-border dark:border-border'}
                        rounded-xl 
                        focus:ring-2 focus:ring-primary/50 focus:border-primary 
                        outline-none transition
                        placeholder:text-muted-foreground dark:placeholder:text-neutral-500
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${className}
                    `}
                    maxLength={15} // xxxxx-xxxxxxx-x = 15 characters
                    aria-invalid={!!(error || validationError)}
                    aria-describedby={error || validationError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
                    {...props}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-xs text-muted-foreground dark:text-neutral-500">
                        {value ? value.replace(/\D/g, '').length : 0}/13
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
                Format: xxxxx-xxxxxxx-x (13 digits)
            </p>
        </div>
    );
});

CNICTextField.displayName = 'CNICTextField';