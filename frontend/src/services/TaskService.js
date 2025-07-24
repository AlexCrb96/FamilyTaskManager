import axios from 'axios';

const baseURL = 'https://localhost:7003/api/tasks';

const TaskService = {
    getAllTasks: async () => {
        try {
            const response = await axios.get(baseURL,
                {
                    timeout: 3000, // 3 seconds timeout
                    headers: {
                        Accept: 'application/json',
                    },
                },
            );
        } catch (err) {
            if (err.code === 'ECONNABORTED') {
                console.log('The request timed out.');
            } else {
                console.log(err);
            }
        }
    },
    addTask: async (task) => {
        const response = await axios.post(baseURL, task);
        return response.data;
    },
    updateTask: async (id, product) => {
        const response = await axios.put('${baseURL}/${id}', product);
        return response.data;
    }
};

export default TaskService;