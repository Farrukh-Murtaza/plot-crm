import React, { forwardRef } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
    required?: boolean;
    className?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
    label,
    error,
    helperText,
    required = false,
    className = '',
    id,
    name,
    rows = 3,
    ...props
}, ref) => {
    const inputId = id || name || 'textarea-field';
    const displayError = error;

    return (
        <div className="space-y-1.5">
            {/* Label */}
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-foreground dark:text-white mb-1"
                >
                    {label}
                    {required && <span className="text-danger ml-1">*</span>}
                </label>
            )}

            {/* Textarea */}
            <textarea
                ref={ref}
                id={inputId}
                name={name}
                rows={rows}
                className={`
                    w-full px-3 py-2 
                    bg-surface dark:bg-surface-elevated 
                    border 
                    ${displayError ? 'border-danger' : 'border-border'}
                    rounded-xl 
                    focus:ring-2 focus:ring-primary/50 focus:border-primary 
                    outline-none
                    transition
                    text-foreground dark:text-white
                    placeholder:text-muted-foreground
                    disabled:opacity-50 disabled:cursor-not-allowed
                    resize-y
                    ${className}
                `}
                aria-invalid={!!displayError}
                aria-describedby={displayError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
                required={required}
                {...props}
            />

            {/* Error Message */}
            {displayError && (
                <p id={`${inputId}-error`} className="text-sm text-danger">
                    {displayError}
                </p>
            )}

            {/* Helper Text */}
            {helperText && !displayError && (
                <p id={`${inputId}-helper`} className="text-sm text-muted-foreground">
                    {helperText}
                </p>
            )}
        </div>
    );
});

Textarea.displayName = 'Textarea';