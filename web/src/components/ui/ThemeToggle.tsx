import {
    Moon,
    Sun,
} from "lucide-react";

import { useTheme } from "../../context/ThemeContext";

export const ThemeToggle = () => {
    const {
        theme,
        toggleTheme,
    } = useTheme();

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-lg
                border
                border-border
                bg-surface
                text-muted-foreground
                transition-colors
                hover:bg-muted
                hover:text-foreground
            "
            aria-label="Toggle theme"
        >
            {theme === "dark" ? (
                <Sun size={18} />
            ) : (
                <Moon size={18} />
            )}
        </button>
    );
};