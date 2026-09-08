import type {
    HTMLAttributes,
    ReactNode,
} from "react";

interface CardProps
    extends HTMLAttributes<HTMLDivElement> {
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
                rounded-dashboard
                border
                border-border
                bg-card
                text-card-foreground
                shadow-card
                ${className}
            `}
        >
            {children}
        </div>
    );
};