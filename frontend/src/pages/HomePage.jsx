import React, { useState, useEffect, useContext } from "react";

import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import UserService from "../services/UserService";
import TaskService from "../services/TaskService";
import ShowTasksForm from "../components/forms/ShowTasksForm";
import TopBarForm from "../components/forms/TopBarForm";
import UtilitiesBarForm from "../components/forms/UtilitiesBarForm";
import EditTaskModal from "../components/modals/EditTaskModal";

export default function HomePage() {
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [editingTask, setEditingTask] = useState(null);

    useEffect(() => {
        fetchTasks();
        fetchUsers();
    }, []);

    const fetchTasks = async (keywords = "") => {
        const data = await TaskService.getFilteredTasks({ keywords });
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
        const normalizedAssignedUserId = assignedUser ? assignedUser.id : "unassigned";

        const taskWithNormalizedInput = {
            ...task,
            assignedUserId: normalizedAssignedUserId
        };
        setEditingTask(taskWithNormalizedInput);
    };

    const handleCreateClick = () => {
        setEditingTask({
            title: "",
            description: "",
            dueDate: null,
            status: "ToDo",
            assignedUserId: "unassigned"
        });
    };

    const handleSave = async (task) => {

        if (!task.id) {
            await TaskService.addTask(task);
        } else {
            const changedFields = {};

            Object.keys(task).forEach((key) => {
                if (task[key] !== editingTask[key]) {
                    changedFields[key] = task[key];
                }
            });

            if (Object.keys(changedFields).length > 0) {
                await TaskService.updateTask(editingTask.id, changedFields);
            }
        }
        fetchTasks();
        setEditingTask(null);
    }

    const handleDelete = async (taskId) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            await TaskService.deleteTask(taskId);
            await fetchTasks();
        }
    };

    const handleCancel = () => {
        setEditingTask(null);
    };

    return (
        <div>
            <TopBarForm onLogout={handleLogout} />
            <UtilitiesBarForm onCreate={handleCreateClick} onSearch={fetchTasks} />
            <ShowTasksForm tasks={tasks} onEdit={handleEditClick} onDelete={handleDelete} />
            <EditTaskModal show={!!editingTask} task={editingTask} users={users} onSave={handleSave} onCancel={handleCancel} />
        </div>
    );
}