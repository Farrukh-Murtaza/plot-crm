import type {
    InputHTMLAttributes,
} from "react";

import type {
    LucideIcon,
} from "lucide-react";

interface TextFieldProps
    extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    icon?: LucideIcon;
    error?: string;
    helperText?: string;
    required?: boolean;
}

export const TextField = ({
    label,
    icon: Icon,
    id,
    error,
    helperText,
    required = false,
    className = "",
    ...props
}: TextFieldProps) => {
    const inputId = id || props.name || 'text-field';
    const displayError = error;

    return (
        <div className="space-y-1.5">
            {/* Label */}
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-foreground mb-1"
                >
                    {label}
                    {required && <span className="text-danger ml-1">*</span>}
                </label>
            )}

            {/* Input Wrapper */}
            <div className="relative">
                {/* Icon */}
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ">
                        <Icon size={18} className="text-muted-foreground" />
                    </div>
                )}

                {/* Input */}
                <input
                    id={inputId}
                    {...props}
                    className={`
                        w-full
                        rounded-xl
                        border-2
                        ${displayError ? 'border-danger' : 'border-border'}
                        bg-input
                        py-2
                        text-foreground
                        outline-none
                        transition
                        placeholder:text-muted-foreground
                        focus:border-primary
                        focus:ring-2
                        focus:ring-ring
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                        ${Icon ? "pl-10" : "px-3"}
                        ${className}
                    `}
                    aria-invalid={!!displayError}
                    aria-describedby={displayError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
                    required={required}
                />
            </div>

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
};

TextField.displayName = 'TextField';