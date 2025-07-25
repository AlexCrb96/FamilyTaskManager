import axios from "../utils/axiosInstance";

const UserService = {
    getAllUsers: async () => {
        const response = await axios.get("/users");
        return response.data;
    }
};

export default UserService;