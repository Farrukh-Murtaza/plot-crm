import { LoaderCircle } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: "primary" | "secondary" | "ghost" | "danger";
    loading?: boolean;
}

export const Button = ({
    children,
    variant = "primary",
    loading = false,
    className = "",
    disabled,
    ...props
}: ButtonProps) => {
    const variants = {
        primary: `
            bg-primary
            hover:bg-primary-hover
           text-primary-foreground
         
        `,

        secondary: `
           bg-surface
            border
            border-border
            text-foreground
            hover:bg-muted
        `,

        ghost: `
            bg-transparent
            hover:bg-corporate-hover
            text-text-secondary
        `,
        danger: `
            bg-danger
            text-white
            hover:opacity-90
        `,
    };

    return (
        <button
            {...props}
            disabled={disabled || loading}
            className={`
                px-4
                py-2.5
                rounded-xl
                font-semibold
                transition-all
                duration-200
                flex
                items-center
                justify-center
                gap-2
                disabled:opacity-50
                disabled:cursor-not-allowed
                ${variants[variant]}
                ${className}
            `}
        >
            {loading && (
                <LoaderCircle
                    size={18}
                    className="animate-spin"
                />
            )}

            {children}
        </button>
    );
};