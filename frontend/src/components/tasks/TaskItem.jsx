import React, { useState } from "react";
import TaskService from "../../services/TaskService";
import TaskItemStatus from "../../enums/TaskItemStatus";

const TaskItem = ({ task, onEdit, users }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTask, setEditedTask] = useState({ ...task });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedTask(prev => ({
            ...prev,
            [name]: value === "" && name === "assignedUserId" ? null : value
        }));
    };

    const handleStatusChange = (newStatus) => {
        setEditedTask(prev => ({
            ...prev,
            status: newStatus
        }));
    };

    const handleSave = async () => {
        const changedFields = {};

        Object.keys(editedTask).forEach(key => {
            if (editedTask[key] !== task[key]) {
                changedFields[key] = editedTask[key];
            }
        });

        if (Object.keys(changedFields).length > 0) {
            await TaskService.updateTask(task.id, changedFields);
        }

        setIsEditing(false);
        onEdit();
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedTask({ ...task });
    }

    return (
        <li className="list-group-item">
            {isEditing ? (
                <div className="row">
                    <div className="col">
                        <input
                            name="title"
                            value={editedTask.title}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                    <div className="col">
                        <input
                            name="description"
                            value={editedTask.description}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                    <div className="col">
                        <input
                            type="date"
                            name="dueDate"
                            value={editedTask.dueDate}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                    <div className="col">
                        <select
                            name="status"
                            value={editedTask.status}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            className="form-select"
                        >
                            {Object.entries(TaskItemStatus).map(([key, value]) => (
                                <option key={key} value={value}>
                                    {value}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col">
                        <select
                            name="assignedUserId"
                            value={editedTask.assignedUserId || ""}
                            onChange={handleChange}
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
                        <button className="btn btn-success me-1" onClick={handleSave}>Save</button>
                        <button className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
                    </div>
                </div>
            ) : (
                <div className="d-flex justify-content-between align-items-center">
                    <span>{task.title} - {task.description} - {task.status} - {task.dueDate} - {task.assignedUserEmail}</span>
                    <div>
                       {/* <button className="btn btn-danger me-2" onClick={onDelete}>Delete</button>*/}
                            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>Edit</button>
                    </div>
                </div>
            )
            }
        </li>
    );
};

export default TaskItem;