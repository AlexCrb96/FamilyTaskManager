import axios from "../utils/axiosInstance";

const UserService = {
    getAllUsers: async () => {
        const response = await axios.get("/users");
        return response.data;
    },

    login: async (email, password) => {
        try {
            const response = await axios.post("/users/login", { email, password });
            return response.data;
        } catch (error) {
            console.error("Login failed: ", error);
            return null;
        }
    },

    register: async (email, password) => {
        const response = await axios.post("/users/register", { email, password });
        return response.data;
    }
};

export default UserService;