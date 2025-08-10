import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";

import { AuthContext } from "../context/AuthContext";
import UserService from "../services/UserService";
import TaskService from "../services/TaskService";
import ShowTasksForm from "../components/forms/ShowTasksForm";
import EditTaskForm from "../components/forms/EditTaskForm";

export default function HomePage() {
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [editingTask, setEditingTask] = useState(null);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        fetchTasks();
        fetchUsers();
    }, []);

    const fetchTasks = async () => {
        const data = await TaskService.getAllTasks();
        setTasks(data);
    };

    const fetchUsers = async() => {
        const data = await UserService.getAllUsers();
        setUsers(data);
    };

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const handleEditClick = (task) => {
        const assignedUser = users.find(u => u.email === task.assignedUserEmail);
        const taskWithAssignedUserId = { ...task, assignedUserId: assignedUser ? assignedUser.id : "unassigned" };
        setEditingTask(taskWithAssignedUserId);
    };

    const handleCreateClick = () => {
        setEditingTask({
            title: "",
            description: "",
            dueDate: "",
            status: "ToDo",
            assignedUserId: "unassigned"
        });
        setIsCreating(true);
    }

    const handleSave = async (taskToSave) => {
        if (isCreating) {
            await TaskService.addTask(taskToSave)
        }
        else {
            const changedFields = {};

            Object.keys(taskToSave).forEach(key => {
                if (taskToSave[key] !== editingTask[key]) {
                    changedFields[key] = taskToSave[key];
                }
            });

            if (Object.keys(changedFields).length > 0) {
                await TaskService.updateTask(editingTask.id, changedFields);
            }
        }
        
        await fetchTasks();
        setEditingTask(null);
        setIsCreating(false);
    };

    const handleCancel = () => {
        setEditingTask(null);
        setIsCreating(false);
    };

    return (
        <div>
            <button onClick={handleLogout}>Logout</button>
            <button onClick={handleCreateClick}>Create a task</button>

            <ShowTasksForm tasks={tasks} users={users} onEdit={handleEditClick} />

            <Modal show={!!editingTask} onHide={handleCancel}>
                <Modal.Header closeButton>
                    <Modal.Title>{isCreating ? "Create a task" : "Edit Task"}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {editingTask && (
                        <EditTaskForm
                            initialTask={editingTask}
                            onSubmit={handleSave}
                            onCancel={handleCancel}
                            users={users}
                        />
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
}