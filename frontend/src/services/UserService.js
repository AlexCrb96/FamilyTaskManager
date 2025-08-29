import axios from "../utils/axiosInstance";

const UserService = {
    getAllUsers: async () => {
        const response = await axios.get("/users");
        return response.data;
    },

    getToken: async (email, password) => {
        try {
            const response = await axios.post("/users/login", { email, password });
            return response.data;
        } catch (error) {
            console.error("Login failed: ", error);
            return null;
        }
    },

    getTokenExpiration(token) {
        if (!token) return null;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp * 1000; // convert to milliseconds
        } catch {
            return null;
        }
    },

    register: async (email, password) => {
        const response = await axios.post("/users/register", { email, password });
        return response.data;
    },

    login: async (email, password, loginCallback, setError, onSuccess) => {
        setError("");
        try {
            const token = await UserService.getToken(email, password);
            if (token) {
                loginCallback(token);
                if (onSuccess) onSuccess();
            } else {
                setError("Login failed.");
            }
        } catch {
            setError("Login Failed.");
        }
    },

    forgotPassword: async (email) => {
        const response = await axios.post("/users/forgot-password", { email });
        return response.data;
    },

    resetPassword: async (token, newPassword) => {
        const response = await axios.post("/users/reset-password", { token, newPassword });
        return response.data;
    },

    changePassword: async (oldPassword, newPassword) => {
        const response = await axios.post("users/change-password", { oldPassword, newPassword });
        return response.data;
    },

    changeNames: async (firstName, lastName) => {
        const response = await axios.put("users/change-name", { firstName, lastName });
        return response.data;
    },

    getCurrentUser: async () => {
        const response = await axios.get("users/me");
        return response.data;
    }
};

export default UserService;