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
    const [showDone, setShowDone] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

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

    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const visibleTasks = showDone ? tasks : tasks.filter((t) => t.status !== "Done");

    const sortedTasks = React.useMemo(() => {
        let sortable = [...visibleTasks];
        if (sortConfig.key) {
            sortable.sort((a, b) => {
                let aVal = a[sortConfig.key];
                let bVal = b[sortConfig.key];

                if (!aVal) aVal = "";
                if (!bVal) bVal = "";

                if (sortConfig.key === "dueDate") {
                    aVal = aVal ? new Date(aVal) : new Date(0);
                    bVal = bVal ? new Date(bVal) : new Date(0);
                }

                if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;

                return 0;
            });
        }
        return sortable;
    }, [visibleTasks, sortConfig]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-6 space-y-6">
            <TopBarForm onLogout={handleLogout} />
            <UtilitiesBarForm onCreate={handleCreateClick} onSearch={fetchTasks} onToggleShowDone={setShowDone} />
            <ShowTasksForm tasks={sortedTasks} onEdit={handleEditClick} onDelete={handleDelete} onSort={handleSort} sortConfig={sortConfig} />
            <EditTaskModal show={!!editingTask} task={editingTask} users={users} onSave={handleSave} onCancel={handleCancel} />
        </div>
    );
}