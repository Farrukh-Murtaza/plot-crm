import {
    BarChart3,
    Building2,
    ChevronLeft,
    ChevronRight,
    Home,
    LayoutDashboard,
    Settings,
    Users,
} from "lucide-react";
import { SidebarNavItem } from "./SidebarNavItem";

interface SidebarProps {
    collapsed: boolean;
    onToggle: () => void;
}

interface NavItem {
    label: string;
    icon: React.ElementType;
    href: string;
}

const navigation: NavItem[] = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
    },
    {
        label: "Properties",
        icon: Building2,
        href: "/properties",
    },
    {
        label: "Customers",
        icon: Users,
        href: "/customers",
    },
    {
        label: "Reports",
        icon: BarChart3,
        href: "/reports",
    },
];

export const Sidebar = ({
    collapsed,
    onToggle,
}: SidebarProps) => {
    return (
        <aside
            className={`
                relative
                flex
                h-screen
                flex-col
                border-r
                border-border
                bg-surface
                transition-all
                duration-300
                ease-in-out
                ${collapsed ? "w-20" : "w-64"}
            `}
        >
            {/* Logo */}
            <div
                className={`
                    flex
                    h-16
                    items-center
                    border-b
                    border-border
                    px-4
                    ${collapsed
                        ? "justify-center"
                        : "justify-between"
                    }
                `}
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    <div
                        className="
                            flex
                            size-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            bg-primary
                            text-primary-foreground
                        "
                    >
                        <Home size={20} />
                    </div>

                    {!collapsed && (
                        <span
                            className="
                                whitespace-nowrap
                                font-bold
                                text-foreground
                            "
                        >
                            Royal Estates
                        </span>
                    )}
                </div>

                {!collapsed && (
                    <button
                        type="button"
                        onClick={onToggle}
                        className="
                            flex
                            size-8
                            items-center
                            justify-center
                            rounded-md
                            text-muted-foreground
                            transition-colors
                            hover:bg-muted
                            hover:text-foreground
                        "
                        aria-label="Collapse sidebar"
                    >
                        <ChevronLeft size={18} />
                    </button>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 p-3">
                {navigation.map((item) => (
                    <SidebarNavItem
                        key={item.label}
                        label={item.label}
                        icon={item.icon}
                        to={item.href}
                        collapsed={collapsed}
                        end={item.href === "/dashboard"}
                    />
                ))}
            </nav>

            {/* Bottom Navigation */}
            <div className="border-t border-border p-3">
                <SidebarNavItem
                    label="Settings"
                    icon={Settings}
                    to="/settings"
                    collapsed={collapsed}
                />

                {/* Expand button when collapsed */}
                {collapsed && (
                    <button
                        type="button"
                        onClick={onToggle}
                        className="
                            mt-2
                            flex
                            h-11
                            w-full
                            items-center
                            justify-center
                            rounded-lg
                            text-muted-foreground
                            transition-colors
                            hover:bg-muted
                            hover:text-foreground
                        "
                        aria-label="Expand sidebar"
                        title="Expand sidebar"
                    >
                        <ChevronRight size={20} />
                    </button>
                )}
            </div>
        </aside>
    );
};