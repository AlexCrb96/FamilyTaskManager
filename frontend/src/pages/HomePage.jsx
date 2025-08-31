import React, { useState, useEffect, useContext } from "react";

import { AuthContext } from "../context/AuthContext";
import { useSessionExpiry } from "../hooks/useSessionExpiry";
import { useAuthLogout } from "../hooks/useAuthLogout";

import UserService from "../services/UserService";
import TaskService from "../services/TaskService";
import TasksTable from "../components/shared/TasksTable";
import TopBar from "../components/shared/TopBar";
import UtilitiesBarForm from "../components/forms/UtilitiesBarForm";
import EditTaskModal from "../components/modals/EditTaskModal";
import SessionExpiredModal from "../components/modals/SessionExpiredModal";
import ChangePasswordModal from "../components/modals/ChangePasswordModal";
import ViewTaskModal from "../components/modals/ViewTaskModal";

export default function HomePage() {
    const { token } = useContext(AuthContext);
    const { currentUser } = useContext(AuthContext);
    const { sessionExpired, setSessionExpired } = useSessionExpiry(token);

    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [editingTask, setEditingTask] = useState(null);
    const [showDone, setShowDone] = useState(false);
    const [showMine, setShowMine] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const [viewingTask, setViewingTask] = useState(null);

    useEffect(() => {
        fetchTasks();
        fetchUsers();
    },[token]);

    const fetchTasks = async (keywords = "") => {
        const data = await TaskService.getFilteredTasks({ keywords });
        setTasks(data);
    };

    const fetchUsers = async() => {
        const data = await UserService.getAllUsers();
        setUsers(data);
    };

    const handleLogout = useAuthLogout();

    const handleViewClick = (task) => {
        setViewingTask(task);
    };

    const handleEditFromView = (task) => {
        setViewingTask(null);
        handleEditClick(task);
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
                await TaskService.addTask(task).catch(handleError);
            } else {
                const changedFields = {};

                Object.keys(task).forEach((key) => {
                    if (task[key] !== editingTask[key]) {
                        changedFields[key] = task[key];
                    }
                });

                if (Object.keys(changedFields).length > 0) {
                    await TaskService.updateTask(editingTask.id, changedFields).catch(handleError);
                }
            }
            fetchTasks();
            setEditingTask(null);
    }

    const handleError = (error) => {
        if (!error.response) {
            alert("Network error or server not responding. Please try again.");
            return;
        }

        const { status, data } = error.response;
        if (status === 403) {
            alert(data || "You don't have permission to perform this action."); 
            return
        }

        if (error.response?.data?.errors) {
            const errors = error.response.data.errors;
            const firstKey = Object.keys(errors)[0];
            const firstError = errors[firstKey][0];
            alert(firstError);
        } else {
            alert("An unexpected error occurred.");
        }
    };

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

    const visibleTasks = tasks.filter(task => {
        if (!showDone && task.status === "Done") return false;

        if (showMine && task.assignedUserEmail !== currentUser?.email) return false;

        return true;
    });

    const getSortableValue = (task, key) => {
        if (key === "dueDate") return task.dueDate ? new Date(task.dueDate) : new Date(0);
        if (key === "status") return task.status;
        if (key === "assignedUserEmail") return task.assignedUserEmail?.toLowerCase() || "Unassigned";
        return task[key];
    };

    const sortedTasks = React.useMemo(() => {
        let sortable = [...visibleTasks];
        if (sortConfig.key) {
            sortable.sort((a, b) => {
                let aVal = getSortableValue(a, sortConfig.key);
                let bVal = getSortableValue(b, sortConfig.key);

                if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;

                return 0;
            });
        }
        return sortable;
    }, [visibleTasks, sortConfig]);

    return (
        <>
            <TopBar email={currentUser?.email} onLogout={handleLogout} />
            <div className="min-h-screen bg-gray-100 flex flex-col items-center px-4 py-6 space-y-6">
                <UtilitiesBarForm onCreate={handleCreateClick} onSearch={fetchTasks} onToggleShowDone={setShowDone} onToggleShowMine={setShowMine} />
                <TasksTable tasks={sortedTasks} onView={handleViewClick} onDelete={handleDelete} onSort={handleSort} sortConfig={sortConfig} />
                <ViewTaskModal show={!!viewingTask} task={viewingTask} users={users} onClose={() => setViewingTask(null)} onEdit={handleEditFromView} />
                <EditTaskModal show={!!editingTask} task={editingTask} users={users} onSave={handleSave} onCancel={handleCancel} />
                {sessionExpired && <SessionExpiredModal show={sessionExpired} onClose={() => setSessionExpired(false)} />}
            </div>
        </>        
    );
}