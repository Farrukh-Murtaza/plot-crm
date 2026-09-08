import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: "primary" | "secondary" | "ghost";
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
            bg-brand
            hover:bg-brand-hover
            text-white
            shadow-brand
        `,

        secondary: `
            bg-corporate-surface
            hover:bg-corporate-hover
            border
            border-corporate-border
            text-text-primary
        `,

        ghost: `
            bg-transparent
            hover:bg-corporate-hover
            text-text-secondary
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
                <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />

                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                </svg>
            )}

            {children}
        </button>
    );
};