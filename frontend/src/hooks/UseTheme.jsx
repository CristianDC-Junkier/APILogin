import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

/**
 * Hook para acceder al contexto de tema (modo claro / oscuro).
 *
 * Devuelve:
 * - darkMode: Boolean que indica si el modo oscuro está activado.
 * - toggleMode: Función para alternar entre modo claro y oscuro.
 *
 * Uso:
 * const { darkMode, toggleMode } = useTheme();
 *
 * @returns {Object} Contexto de tema
 */
export const useTheme = () => {
    return useContext(ThemeContext);
};
