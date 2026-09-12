import React, { forwardRef, useCallback } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
    label?: string;
    error?: string;
    helperText?: string;
    options: readonly SelectOption[];
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    placeholder?: string;
    icon?: React.ElementType;
    required?: boolean;
    disabled?: boolean;
    className?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
    label,
    error,
    helperText,
    options,
    value,
    onChange,
    placeholder = 'Select an option',
    icon: Icon,
    required = false,
    disabled = false,
    className = '',
    id,
    name,
    ...props
}, ref) => {
    const inputId = id || name || 'select-field';

    // Validate selection
    const validateSelect = useCallback((selectedValue: string): string => {
        if (required && !selectedValue) {
            return 'This field is required';
        }
        if (required && selectedValue === '') {
            return 'Please select an option';
        }
        return '';
    }, [required]);

    const validationError = value ? validateSelect(value) : required ? 'This field is required' : '';

    // Determine if there's an error to display
    const displayError = error || validationError;

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
                        <Icon className="w-5 h-5 text-gray-400  dark:text-neutral-500" />
                    </div>
                )}

                {/* Select Element */}
                <select
                    ref={ref}
                    id={inputId}
                    name={name}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    required={required}
                    className={`
                        w-full 
                        rounded-xl
                        border-2
                        ${displayError ? 'border-danger' : 'border-border'}
                        bg-input
                        py-2
                        pr-10 
                        text-foreground
                        outline-none 
                        transition
                        focus:border-primary
                        focus:ring-2 
                        focus:ring-ring 
                        appearance-none
                        ${Icon ? 'pl-10' : 'px-3'} 
                        ${className}
                    `}
                    aria-invalid={!!displayError}
                    aria-describedby={displayError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
                    {...props}
                >
                    {/* Placeholder Option */}
                    {placeholder && (
                        <option value="" className="text-gray-400 dark:text-neutral-500">
                            {placeholder}
                        </option>
                    )}

                    {/* Options */}
                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                            className="text-gray-900  bg-white dark:bg-surface-elevated"
                        >
                            {option.label}
                        </option>
                    ))}
                </select>

                {/* Chevron Icon */}
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ChevronDown className="w-5 h-5 text-gray-400 dark:text-neutral-500 transition-transform duration-200" />
                </div>

                {/* Selected value indicator (optional) */}
                {value && (
                    <div className="absolute inset-y-0 right-8 pr-2 flex items-center pointer-events-none">
                        <Check className="w-4 h-4 text-primary" />
                    </div>
                )}
            </div>

            {/* Error Message */}
            {displayError && (
                <p id={`${inputId}-error`} className="text-sm text-red-500 dark:text-red-400">
                    {displayError}
                </p>
            )}

            {/* Helper Text */}
            {helperText && !displayError && (
                <p id={`${inputId}-helper`} className="text-sm text-gray-500 dark:text-neutral-400">
                    {helperText}
                </p>
            )}
        </div>
    );
});

Select.displayName = 'Select';