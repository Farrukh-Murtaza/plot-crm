import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}

export const Card = ({
    children,
    className = "",
    ...props
}: CardProps) => {
    return (
        <div
            {...props}
            className={`
                bg-corporate-card
                border
                border-corporate-border
                rounded-dashboard
                shadow-card
                ${className}
            `}
        >
            {children}
        </div>
    );
};