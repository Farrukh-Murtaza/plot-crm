import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useState } from "react";
import type { InputHTMLAttributes } from "react";


interface PasswordFieldProps
    extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export const PasswordField = ({
    label,
    id,
    className = "",
    ...props
}: PasswordFieldProps) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div>
            <label
                htmlFor={id}
                className="
                    block
                    text-sm
                    font-semibold
                    text-text-primary
                    mb-1.5
                "
            >
                {label}
            </label>

            <div className="relative">
                <div
                    className="
                            absolute
                            inset-y-0
                            left-0
                            pl-3
                            flex
                            items-center
                            pointer-events-none
                            text-text-muted
                        "
                >
                    <LockKeyhole className="w-5 h-5 text-text-muted" />
                </div>

                <input
                    id={id}
                    type={showPassword ? "text" : "password"}
                    {...props}
                    className={`
                        w-full
                        pl-10
                        pr-12
                        py-3
                        bg-corporate-dark
                        border
                        border-corporate-border
                        rounded-xl
                        text-text-primary
                        placeholder:text-text-muted
                        outline-none
                        transition
                        focus:border-brand
                        focus:ring-2
                        focus:ring-brand/20
                        ${className}
                    `}
                />

                <button
                    type="button"
                    onClick={() =>
                        setShowPassword((previous) => !previous)
                    }
                    className="
                        absolute
                        inset-y-0
                        right-0
                        px-4
                        text-text-muted
                        hover:text-brand-light
                        transition
                    "
                    aria-label={
                        showPassword
                            ? "Hide password"
                            : "Show password"
                    }
                >
                    {showPassword ? (
                        <EyeOff className="h-5 w-5" aria-hidden="true" />
                    ) : (
                        <Eye className="h-5 w-5" aria-hidden="true" />
                    )}
                </button>

            </div>
        </div>
    );
};