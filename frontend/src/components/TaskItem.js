import React, { useState } from 'react';
import TaskService from '../services/TaskService';
import TaskItemStatus from '../enums/TaskItemStatus';

const TaskListItem = ({ task, onDelete, onEdit }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(task.title);
    const [editedDescription, setEditedDescription] = useState(task.description);
    const [editedDueDate, setEditedDueDate] = useState(task.dueDate);
    const [editedStatus, setEditedStatus] = useState(task.status);]
    const [editedAssignedUser, setEditedAssignedUser] = useState(task.assignedUser || " ");]
    const handleEdit = async () => {
        setIsEditing(true);
    };
    const handleSave = async () => {
        const editedTask = {
            ...task,
            title: editedTitle,
            description: editedDescription,
            dueDate: editedDueDate,
            status: TaskItemStatus[editedStatus],
            assignedUser: editedAssignedUser,
        };
        try {
            await TaskService.updateTask(task.id, editedTask);
            setIsEditing(false);
            onEdit(); // Refresh the task list after editing
        } catch (error) {
            console.erro('Error updating task:', error);)
        }
    };
    const handleCancel = () => {
        setIsEditing(false);
        // Reset the edited values to the original task values
        setEditedTitle(task.title);
        setEditedDescription(task.description);
        setEditedDueDate(task.dueDate);
        setEditedStatus(task.status);
        setEditedAssignedUser(task.assignedUser || " ");
    };
    return (
        <li className="task-list-item">
            {isEditing ? (
                <div className="row">
                    <div className="col">
                        <input
                            type="text"
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            className="form-control"
                        />
                    </div>
                    <div className="col">
                        <input
                            type="text"
                            value={editedDescription}
                            onChange={(e) => setEditedDescription(e.target.value)}
                            className="form-control"
                        />
                    </div>
                    <div className="col">
                        <input
                            type="date"
                            value={editedDueDate}
                            onChange={(e) => setEditedDueDate(e.target.value)}
                            className="form-control"
                        />
                    </div>
                    <div className="col">
                        <select
                            value={editedStatus}
                            onChange={(e) => setEditedStatus(e.target.value)}
                            className="form-select"
                        >
                            {Object.keys(TaskItemStatus).map((status) => (
                                <option key={status} value={status}>
                                    {TaskItemStatus[status]}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col">
                        <select
                            value={editedAssignedUser}
                            onChange={(e) => setEditedAssignedUser(e.target.value)}
                            className="form-select"
                        >
                            <option value="">Unassigned</option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.email}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-auto">
                        <button className="btn btn-success" onClick={handleSave}>
                            Save
                        </button>
                        <button className="btn btn-secondary" onClick={handleCancel}>
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div className="d-flex justify-content-between align-items-center">
                    <span>{task.Title} - {task.description} - {task.status} - {task.dueDate} - {task.assignedUser}</span>
                    <div>
                        <button className="btn btn-danger me-2" onClick={onDelete}>Delete</button>
                        <button className="btn btn-primary" onClick={handleEdit}>Edit</button>
                    </div>
                </div>
            )
            }
        </li>
    );
};

export default TaskListItem;