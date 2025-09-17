import axios from "../utils/axiosInstance";

const TaskService = {
    getAllTasks: async () => {
        const response = await axios.get("/TaskItems");
        return response.data;
    },
    addTask: async (task) => {
        const response = await axios.post("/TaskItems/create", task);
        return response.data;
    },
    updateTask: async (taskId, changedFields) => {
        const payload = {};
        Object.keys(changedFields).forEach((key) => {
            if (changedFields[key] !== undefined) {
                payload[key] = changedFields[key];
            }
        });

        const response = await axios.patch(
            `/TaskItems/${taskId}/editTask`,
            payload,
            { headers: { "Content-type": "application/json" } });

        return response.data;
    },
    deleteTask: async (taskId) => {
        await axios.delete(`/TaskItems/${taskId}`);
    },
    getFilteredTasks: async (filters = {}) => {
        // clone the filters so we don't alter user's input
        const params = { ...filters };

        Object.keys(params).forEach((k) => {
            if (params[k] === "" || params[k] === null || params[k] === undefined) {
                delete params[k];
            }
        });

        if (params.dueDate instanceof Date) {
            params.dueDate = params.dueDate.toISOString().split("T")[0];
        }

        const response = await axios.get("/TaskItems", { params });
        return response.data;
    }
};

export default TaskService;