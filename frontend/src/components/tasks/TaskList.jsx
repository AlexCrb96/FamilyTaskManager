import React, { useState, useEffect } from 'react';
import TaskService from '../../services/TaskService';
import UserService from '../../services/UserService';
import TaskItem from './TaskItem';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchTasks();
        fetchUsers();
    }, []);

    const fetchTasks = async () => {
        const data = await TaskService.getAllTasks();
        setTasks(data);
    };

    const fetchUsers = async () => {
        const data = await UserService.getAllUsers();
        setUsers(data);
    };

    const handleEdit = () => {
        fetchTasks(); // Refresh the task list after editing
    };

    return (
        <div className="container">
            <h2 className="my-4">Tasks list</h2>
            <ul className="list-group">
                {tasks.length > 0 ? (
                    tasks.map(task => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            onEdit={handleEdit}
                            users={users}
                        />
                    ))
                ) : (
                        <li className="list-group-item">No tasks found.</li>
                )}
            </ul>
        </div>
    );
};

export default TaskList;