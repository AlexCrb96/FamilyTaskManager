import React, { useState } from "react";
import { InputField, SelectField } from "./FormFields";
import TaskItemStatus from "../../enums/TaskItemStatus";

const EditTaskForm = ({ initialTask, onSubmit, onCancel, users = [] }) => {
    const [task, setTask] = useState(initialTask || { title: "", description: "", dueDate: "", status: "ToDo", assignedUserId: "unassigned" });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTask((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(task);
    };

    return (
        <form onSubmit={handleSubmit} className="task-form">
            <InputField name="title" placeholder="Task title" value={task.title} onChange={handleChange} required />
            <InputField name="description" placeholder="Task description" value={task.description} onChange={handleChange} />
            <InputField name="dueDate" placeholder="Task due date" value={task.dueDate} onChange={handleChange} type="date" />
            <SelectField
                name="status"
                value={task.status}
                onChange={handleChange}
                options={Object.entries(TaskItemStatus).map(([key, value]) => ({ key, label: value, value }))}
            />
            <SelectField
                name="assignedUserId"
                value={task.assignedUserId || "unassigned"}
                onChange={handleChange}
                options={[
                    { key: "none", label: "Unassigned", value: "unassigned" },
                    ...users.map((user) => (
                        {key: user.id, label: user.email, value: user.id}))
                ]}
            />
            <div className="mt-2">
                <button type="submit">Save</button>
                <button type="button" onClick={onCancel}>Cancel</button>
            </div>
        </form>
    )
};

export default EditTaskForm;