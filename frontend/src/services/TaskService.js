import axios from "../utils/axiosInstance";

const TaskService = {
    getAllTasks: async () => {
        const response = await axios.get("/tasks");
        return response.data;
    },
    addTask: async (task) => {
        const response = await axios.post("/tasks", task);
        return response.data;
    },
    updateTask: async (id, task) => {
        const response = await axios.put(`/tasks/${id}`, task);
        return response.data;
    }
};

export default TaskService;