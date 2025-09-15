/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect } from 'react';
import { login } from '../services/AuthService';
import CryptoJS from 'crypto-js';

export const AuthContext = createContext();

// 🔐 Clave para cifrar (mejor usar variable de entorno .env)
const SECRET_KEY = "WopMzMtUjl6jYV86gRG6LyKhIf83W0JI";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    /**
     * Guarda el usuario encriptado en storage (local o session)
     * @param {Object} userData - Usuario
     * @param {boolean} rememberMe - Si es true => localStorage, si no => sessionStorage
     */
    const saveUserWithExpiry = (userData, rememberMe) => {
        const now = new Date();
        const item = {
            value: userData,
            expiry: now.getTime() + 60 * 60 * 1000, // expira en 1 hora
        };

        const encrypted = CryptoJS.AES.encrypt(
            JSON.stringify(item),
            SECRET_KEY
        ).toString();

        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem("user", encrypted);

        console.log(
            `✅ Usuario guardado en ${rememberMe ? "localStorage" : "sessionStorage"}`
        );
    };

    /**
     * Recupera el usuario desde storage (sessionStorage > localStorage)
     * y valida expiración + desencriptado
     */
    const getUserWithExpiry = () => {
        const encrypted =
            sessionStorage.getItem("user") || localStorage.getItem("user");

        if (!encrypted) return null;

        try {
            const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
            const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

            const now = new Date();
            if (now.getTime() > decrypted.expiry) {
                sessionStorage.removeItem("user");
                localStorage.removeItem("user");
                return null;
            }
            return decrypted.value;
        } catch (error) {
            console.error("❌ Error desencriptando usuario:", error);
            sessionStorage.removeItem("user");
            localStorage.removeItem("user");
            return null;
        }
    };

    // ---------- Restaurar usuario al cargar la app ----------
    useEffect(() => {
        const storedUser = getUserWithExpiry();
        if (storedUser) setUser(storedUser);
        setLoading(false);
    }, []);


    // ---------- Login ----------
    const contextLogin = async (credentials) => {
        const result = await login(credentials);
        if (result.success) {
            setUser(result.data.user);
            saveUserWithExpiry(result.data.user, credentials.rememberMe);
        } else {
            setUser(null);
            sessionStorage.removeItem("user");
            localStorage.removeItem("user");
        }
        return result;
    };

    // ---------- Logout ----------
    const contextLogout = async () => {
        setUser(null);
        sessionStorage.removeItem("user");
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login: contextLogin,
                logout: contextLogout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
