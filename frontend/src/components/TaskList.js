import React, { useState, useEffect } from 'react';
import TaskService from '../services/TaskService';
import UserService from '../services/UserService';
import TaskListItem from './TaskItem';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    useEffect(() => {
        fetchTasks();
        fetchUsers();
    }, []);
    const fetchTasks = async () => {
        try {
            const tasksData = await TaskService.getAllTasks();
            setTasks(tasksData);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
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
                {Array.isArray(tasks) && tasks.length > 0 ? (
                    tasks.map(task => (
                        <TaskListItem key={task.id} task={task} onEdit={handleEdit} users = { users } />
                    ))
                ) : (
                    <p>No tasks found.</p>
                )}
            </ul>
        </div>
    );
};

export default TaskList;