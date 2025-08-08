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
    updateDescription: async (taskId, description) => {
        const response = await axios.put(
            `/TaskItems/${taskId}/updateDescription`,
            JSON.stringify(description),
            { headers: { "Content-type": "application/json" } });
        return response.data;
    },
    updateDueDate: async (taskId, dueDate) => {
        const response = await axios.put(
            `/TaskItems/${taskId}/updateDueDate`,
            JSON.stringify(dueDate),
            { headers: { "Content-type": "application/json" } });
        return response.data;
    },
    updateStatus: async (taskId, newStatus) => {
        const response = await axios.put(`/TaskItems/${taskId}/updateStatus/${newStatus}`);
        return response.data;
    },
    assignUser: async (taskId, userId) => {
        const response = await axios.put(`/TaskItems/${taskId}/assignUser/${userId}`);
        return response.data;
    },
    updateTask: async (taskId, changedFields) => {
        const promises = [];

        if ("description" in changedFields) {
            promises.push(TaskService.updateDescription(taskId, changedFields.description));
        }
        if ("dueDate" in changedFields) {
            promises.push(TaskService.updateDueDate(taskId, changedFields.dueDate));
        }
        if ("status" in changedFields) {
            promises.push(TaskService.updateStatus(taskId, changedFields.status));
        }
        if ("assignedUserId" in changedFields) {
            promises.push(TaskService.assignUser(taskId, changedFields.assignedUserId));
        }

        await Promise.all(promises);
    }
};

export default TaskService;