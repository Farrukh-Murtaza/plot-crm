import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<
    ThemeContextType | undefined
>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider = ({
    children,
}: ThemeProviderProps) => {
    const [theme, setTheme] = useState<Theme>(() => {
        const savedTheme = localStorage.getItem("theme");

        if (
            savedTheme === "light" ||
            savedTheme === "dark"
        ) {
            return savedTheme;
        }

        return "dark";
    });

    useEffect(() => {
        document.documentElement.classList.remove(
            "light",
            "dark"
        );

        document.documentElement.classList.add(theme);

        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((currentTheme) =>
            currentTheme === "dark"
                ? "light"
                : "dark"
        );
    };

    return (
        <ThemeContext.Provider
            value={{
                theme,
                toggleTheme,
                setTheme,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error(
            "useTheme must be used within ThemeProvider"
        );
    }

    return context;
};