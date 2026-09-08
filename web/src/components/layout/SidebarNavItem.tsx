import type { ElementType } from "react";
import { NavLink } from "react-router-dom";

interface SidebarNavItemProps {
    label: string;
    icon: ElementType;
    to: string;
    collapsed: boolean;
    end?: boolean;
}

export const SidebarNavItem = ({
    label,
    icon: Icon,
    to,
    collapsed,
    end = false,
}: SidebarNavItemProps) => {
    return (
        <NavLink
            to={to}
            end={end}
            title={collapsed ? label : undefined}
            className={({ isActive }) => `
                group
                flex
                h-11
                items-center
                rounded-lg
                transition-colors
                ${collapsed
                    ? "justify-center"
                    : "gap-3 px-3"
                }
                ${isActive
                    ? "bg-primary/10 text-primary"
                    : `
                            text-muted-foreground
                            hover:bg-muted
                            hover:text-foreground
                        `
                }
            `}
        >
            <Icon
                size={20}
                className="shrink-0"
            />

            {!collapsed && (
                <span className="whitespace-nowrap text-sm font-medium">
                    {label}
                </span>
            )}
        </NavLink>
    );
};