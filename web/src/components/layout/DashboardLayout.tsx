import {
    useState,
    type ReactNode,
} from "react";

import { Sidebar } from "./Sidebar";

interface DashboardLayoutProps {
    children: ReactNode;
}

export const DashboardLayout = ({
    children,
}: DashboardLayoutProps) => {
    const [sidebarCollapsed, setSidebarCollapsed] =
        useState(false);

    const toggleSidebar = () => {
        setSidebarCollapsed(
            (previous) => !previous
        );
    };

    return (
        <div className="flex min-h-screen bg-background">

            <Sidebar
                collapsed={sidebarCollapsed}
                onToggle={toggleSidebar}
            />

            <main
                className="
                    min-w-0
                    flex-1
                    overflow-auto
                    bg-background
                    p-6
                    transition-all
                    duration-300
                "
            >
                {children}
            </main>

        </div>
    );
};