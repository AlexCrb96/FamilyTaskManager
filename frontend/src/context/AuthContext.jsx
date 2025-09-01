import { createContext, useState, useEffect } from "react";
import UserService from "../services/UserService";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            if (!token) {
                setCurrentUser(null);
                return;
            }
            const userData = await UserService.getCurrentUser();
            if (userData) {
                setCurrentUser({ id: userData.id, email: userData.email, firstName: userData.firstName, lastName: userData.lastName });
            }
        };
        fetchUser();
    }, [token]);

    const login = (token) => {
        localStorage.setItem("token", token);
        setToken(token);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, login, logout, currentUser, setCurrentUser }}>
            {children}
        </AuthContext.Provider>
    );
};