import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";

import UserService from "../services/UserService";
import TaskService from "../services/TaskService";
import ShowTasksForm from "../components/forms/ShowTasksForm";
import EditTaskForm from "../components/forms/EditTaskForm";
import TopBarForm from "../components/forms/TopBarForm";

export default function HomePage() {

    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [editingTask, setEditingTask] = useState(null);
    const [isCreating, setIsCreating] = useState(false);

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
    };

    const handleDelete = async (taskId) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            await TaskService.deleteTask(taskId);
            await fetchTasks();
        }
    };
      
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
            <TopBarForm/>

            <ShowTasksForm
                tasks={tasks}
                onEdit={handleEditClick}
                onDelete={handleDelete}
                onCreate={handleCreateClick}
                onSearch={fetchTasks}
            />

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