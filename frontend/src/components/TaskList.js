import React, { useState, useEffect } from 'react';
import TaskService from '../services/TaskService';
import TaskListItem from './TaskItem';
import TaskItemStatus from '../enums/TaskItemStatus';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    useEffect(() => {
        fetchTasks();
    }, []);
    const fetchTasks = async () => {
        try {
            const tasksData = await TaskService.getAllTasks();
            setTasks(tasksData);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
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
                        <TaskListItem key={task.id} task={task} onEdit={handleEdit} />
                    ))
                ) : (
                    <p>No tasks found.</p>
                )}
            </ul>
        </div>
    );
};