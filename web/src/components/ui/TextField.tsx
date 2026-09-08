import type {
    InputHTMLAttributes,
} from "react";

import type {
    LucideIcon,
} from "lucide-react";

interface TextFieldProps
    extends InputHTMLAttributes<HTMLInputElement> {
    label: string;

    icon?: LucideIcon;
}

export const TextField = ({
    label,
    icon: Icon,
    id,
    className = "",
    ...props
}: TextFieldProps) => {
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
                {Icon && (
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
                        <Icon size={18} />
                    </div>
                )}

                <input
                    id={id}
                    {...props}
                    className={`
                        w-full
                        rounded-xl
                        border
                        border-border
                        bg-input
                        py-3
                        text-foreground
                        outline-none
                        transition
                        placeholder:text-muted-foreground
                        focus:border-primary
                        focus:ring-2
                        focus:ring-ring
                        ${Icon ? "pl-10" : "pl-4"}
                        pr-4
                        ${className}
                    `}
                />
            </div>
        </div>
    );
};