import {
    Eye,
    EyeOff,
    Lock,
} from "lucide-react";

import {
    useState,
    type InputHTMLAttributes,
} from "react";

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
    const [showPassword, setShowPassword] =
        useState(false);

    return (
        <div>
            <label
                htmlFor={id}
                className="
                    mb-1.5
                    block
                    text-sm
                    font-semibold
                    text-foreground
                "
            >
                {label}
            </label>

            <div className="relative">

                <div
                    className="
                        pointer-events-none
                        absolute
                        inset-y-0
                        left-0
                        flex
                        items-center
                        pl-3
                        text-muted-foreground
                    "
                >
                    <Lock size={18} />
                </div>

                <input
                    id={id}
                    type={
                        showPassword
                            ? "text"
                            : "password"
                    }
                    {...props}
                    className={`
                        w-full
                        rounded-xl
                        border
                        border-border
                        bg-input
                        py-3
                        pl-10
                        pr-12
                        text-foreground
                        outline-none
                        transition
                        placeholder:text-muted-foreground
                        focus:border-primary
                        focus:ring-2
                        focus:ring-ring
                        ${className}
                    `}
                />

                <button
                    type="button"
                    onClick={() =>
                        setShowPassword(
                            (current) => !current
                        )
                    }
                    className="
                        absolute
                        inset-y-0
                        right-0
                        flex
                        items-center
                        px-4
                        text-muted-foreground
                        transition
                        hover:text-primary
                    "
                    aria-label={
                        showPassword
                            ? "Hide password"
                            : "Show password"
                    }
                >
                    {showPassword ? (
                        <EyeOff size={18} />
                    ) : (
                        <Eye size={18} />
                    )}
                </button>

            </div>
        </div>
    );
};