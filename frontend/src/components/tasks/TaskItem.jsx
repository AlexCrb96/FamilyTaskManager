import React, { useState } from "react";
import TaskService from "../../services/TaskService";
import TaskItemStatus from "../../enums/TaskItemStatus";

const TaskItem = ({ task, onEdit, users }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTask, setEditedTask] = useState({ ...task });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedTask(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        await TaskService.updateTask(task.id, editedTask);
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
                            vlaue={editedTask.title}
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
                            onChange={handleChange}
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
                            name="assignedUser"
                            value={editedTask.assignedUser || ""}
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
                    <span>{task.Title} - {task.description} - {task.status} - {task.dueDate} - {task.assignedUser}</span>
                    <div>
                       {/* <button className="btn btn-danger me-2" onClick={onDelete}>Delete</button>*/}
                        <button className="btn btn-primary" onClick={handleChange}>Edit</button>
                    </div>
                </div>
            )
            }
        </li>
    );
};

export default TaskItem;