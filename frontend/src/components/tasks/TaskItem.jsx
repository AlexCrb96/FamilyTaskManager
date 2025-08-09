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

    const InputField = ({ name, value, onChange, type = "text" }) => (
        <input name={name} value={value} onChange={onChange} className="form-control" type={type} />
    );

    const SelectField = ({ name, value, onChange, options }) => (
        <select name={name} value={value} onChange={onChange} className="form-select" >
            {options.map(({ key, label, value }) => (
                <option key={key} value={value}>{label}</option>            
            ))}
        </select>
    );

    return (
        <li className="list-group-item">
            {isEditing ? (
                <div className="row">
                    <div className="col">
                        <InputField name="title" value={editedTask.title} onChange={handleChange} />
                    </div>
                    <div className="col">
                        <InputField name="description" value={editedTask.description} onChange={handleChange} />
                    </div>
                    <div className="col">
                        <InputField name="dueDate" value={editedTask.dueDate} onChange={handleChange} type="date" />
                    </div>
                    <div className="col">
                        <SelectField
                            name="status"
                            value={editedTask.status}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            options={Object.entries(TaskItemStatus).map(([key, value]) => ({ key, label: value, value }))}
                        />
                    </div>
                    <SelectField
                        name="assignedUserId"
                        value={editedTask.assignedUserId || ""}
                        onChange={handleChange}
                        options={[
                            { key: "none", label: "Unassigned", value: "unassigned" },
                            ...users.map((user) => ({ key: user.id, label: user.email, value: user.id })),
                        ]}
                    />
                    <div className="col-auto">
                        <button className="btn btn-success me-1" onClick={handleSave}>Save</button>
                        <button className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
                    </div>
                </div>
            ) : (
                <div className="d-flex justify-content-between align-items-centr">
                    <span>{task.title} - {task.description} - {task.status} - {task.dueDate} - {task.assignedUserEmail}</span>
                    <button className="btn btn-primary" onClick={() => setIsEditing(true)}>Edit</button>
                </div>
            )}
        </li>
    );
};

export default TaskItem;