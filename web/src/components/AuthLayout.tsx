import type { ReactNode } from "react";

interface AuthLayoutProps {
    children: ReactNode;
}

export const AuthLayout = ({
    children,
}: AuthLayoutProps) => {
    return (
        <div
            className="
                min-h-screen
                flex
                items-center
                justify-center
                bg-linear-to-br
                from-corporate-black
                via-corporate-dark
                to-corporate-surface
                p-4
            "
        >
            <div className="w-full max-w-md">
                {children}
            </div>
        </div>
    );
};