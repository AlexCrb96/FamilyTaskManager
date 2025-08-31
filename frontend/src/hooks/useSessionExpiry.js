import { useEffect, useState } from "react";
import UserService from "../services/UserService";

export function useSessionExpiry(token) {
    const [sessionExpired, setSessionExpired] = useState(false);

    useEffect(() => {
        if (!token) return;

        const expTime = UserService.getTokenExpiration(token);
        if (!expTime) return;

        const now = Date.now();
        const msBeforeExpiry = expTime - now;
        const warningTime = msBeforeExpiry - 5 * 60 * 1000 // 5mins 60s 1000ms

        if (warningTime > 0) {
            const timer = setTimeout(() => {
                setSessionExpired(true);
            }, warningTime);

            return () => clearTimeout(timer);
        } else {
            setSessionExpired(true);
        }
    }, [token]);

    return { sessionExpired, setSessionExpired };
}