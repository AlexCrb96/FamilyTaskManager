import { createContext, useState, useMemo } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("token"));

    const login = (token) => {
        localStorage.setItem("token", token);
        setToken(token);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
    };

    const currentUserEmail = useMemo(() => {
        if (!token) return null;
        try {
            const decoded = jwtDecode(token);
            return decoded.email;
        } catch {
            return null;
        }
    }, [token]);

    return (
        <AuthContext.Provider value={{ token, login, logout, currentUserEmail }}>
            { children }
        </AuthContext.Provider>
    );
};