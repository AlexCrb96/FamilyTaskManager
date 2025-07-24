import axios from 'axios';

const baseURL = 'https://localhost:7003/api/users';

const UserService = {
    getAllUsers: async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(baseURL,
                {
                    timeout: 3000, // 3 seconds timeout
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
            return response.data;
        } catch (err) {
            if (err.code === 'ECONNABORTED') {
                console.log('The request timed out.');
            } else {
                console.log(err);
            }
        }
    }
};

export default UserService;