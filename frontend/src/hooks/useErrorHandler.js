import { useCallback } from "react"

export const useErrorHandler = () => {
    const handleError = useCallback((error) => {
        if (!error.response) {
            alert("Network error or server not responding. Please try again.");
            return;
        }

        const { status, data } = error.response;
        const message = data?.error || "An unexpected error occurred.";
        const details = data?.validationErrors || null;

        return { message, details, status };
    }, []);

    return handleError;
}