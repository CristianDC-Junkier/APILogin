/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useCallback, useContext } from "react";

export const ThemeContext = createContext();

/**
 * Contexto global de tema (modo claro / oscuro)
 * @typedef {Object} ThemeContextType
 * @property {boolean} darkMode - true si el modo oscuro está activado, false si no.
 * @property {Function} toggleMode - Cambia entre modo claro y oscuro y guarda la preferencia en localStorage.
 */

/**
 * Proveedor global de tema con persistencia en localStorage.
 * @param {{ children: React.ReactNode }} props
 * @returns {JSX.Element}
 */
export const ThemeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(false);

    /**
     * Cambia el modo y lo guarda en localStorage
     */
    const toggleMode = useCallback(() => {
        setDarkMode(prev => {
            const newMode = !prev;
            const accepted = localStorage.getItem("IEE-Almonte/cookiesAccepted");
            if (accepted) {
                localStorage.setItem("darkMode", newMode ? "true" : "false");
            }
            return newMode;
        });
    }, []);

    /**
     * Cargar preferencia de localStorage al iniciar
     */
    useEffect(() => {
        const savedMode = localStorage.getItem("darkMode");
        if (savedMode === "true") {
            setDarkMode(true);
        } else {
            setDarkMode(false);
        }
    }, []);

    return (
        <ThemeContext.Provider value={{ darkMode, toggleMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

/**
 * Hook para acceder al contexto de tema.
 * @returns {ThemeContextType} 
 */
export const useTheme = () => useContext(ThemeContext);
