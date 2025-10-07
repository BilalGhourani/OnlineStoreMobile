import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import { darkTheme } from "./dark";
import { lightTheme } from "./light";

type ThemeType = typeof lightTheme;
type ColorOption = "light" | "dark" | "system";

type ThemeContextType = {
    theme: ThemeType;
    colorScheme: ColorOption;
    setTheme: (value: ColorOption) => void;
};

const STORAGE_KEY = "APP_THEME";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const deviceScheme = useColorScheme() ?? "light";
    const [colorScheme, setColorScheme] = useState<ColorOption>("system");

    // Load saved theme from AsyncStorage
    useEffect(() => {
        AsyncStorage.getItem(STORAGE_KEY).then((value) => {
            if (value === "light" || value === "dark" || value === "system") {
                setColorScheme(value);
            }
        });
    }, []);

    // Save theme whenever it changes
    const setTheme = (value: ColorOption) => {
        setColorScheme(value);
        AsyncStorage.setItem(STORAGE_KEY, value);
    };

    // Determine actual theme object based on selection & system preference
    const theme = useMemo(() => {
        const activeScheme = colorScheme === "system" ? deviceScheme : colorScheme;
        return activeScheme === "dark" ? darkTheme : lightTheme;
    }, [colorScheme, deviceScheme]);

    return (
        <ThemeContext.Provider value={{ theme, colorScheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useTheme must be used inside ThemeProvider");
    return context;
};
