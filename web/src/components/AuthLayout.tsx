import type {
    ReactNode,
} from "react";

import { ThemeToggle } from "./ui/ThemeToggle";

interface AuthLayoutProps {
    children: ReactNode;
}

export const AuthLayout = ({
    children,
}: AuthLayoutProps) => {
    return (
        <div
            className="
                relative
                flex
                min-h-screen
                items-center
                justify-center
                bg-background
                p-4
                text-foreground
                transition-colors
                duration-300
            "
        >
            <div className="absolute right-6 top-6">
                <ThemeToggle />
            </div>

            <div className="w-full max-w-md">
                {children}
            </div>
        </div>
    );
};