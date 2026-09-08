import type { InputHTMLAttributes, ReactNode } from "react";

interface TextFieldProps
    extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon?: ReactNode;
}

export const TextField = ({
    label,
    icon,
    className = "",
    id,
    ...props
}: TextFieldProps) => {
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
                {icon && (
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
                        {icon}
                    </div>
                )}

                <input
                    id={id}
                    {...props}
                    className={`
                        w-full
                        ${icon ? "pl-10" : "pl-4"}
                        pr-4
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
            </div>
        </div>
    );
};