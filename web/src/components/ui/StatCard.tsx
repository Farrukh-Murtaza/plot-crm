import type { LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    description?: string;
}

export const StatCard = ({
    title,
    value,
    icon: Icon,
    description,
}: StatCardProps) => {
    return (
        <div
            className="
                rounded-dashboard
                border
                border-border
                bg-card
                p-5
                text-card-foreground
                shadow-sm
                transition-all
                hover:shadow-md
            "
        >
            <div className="flex items-start justify-between">

                <div>
                    <p className="text-sm font-medium text-muted-foreground">
                        {title}
                    </p>

                    <h3 className="mt-2 text-3xl font-bold text-foreground">
                        {value}
                    </h3>

                    {description && (
                        <p className="mt-2 text-xs text-muted-foreground">
                            {description}
                        </p>
                    )}
                </div>

                <div
                    className="
                        flex
                        size-11
                        items-center
                        justify-center
                        rounded-xl
                        bg-primary/10
                        text-primary
                    "
                >
                    <Icon size={22} />
                </div>

            </div>
        </div>
    );
};