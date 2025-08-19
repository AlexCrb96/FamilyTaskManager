import React, { useState } from "react";
import { InputField, SelectField } from "./FormFields";
import TaskItemStatus from "../../enums/TaskItemStatus";

const inputClasses =
    "block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";
const labelClasses = "text-sm font-medium text-gray-700";

const EditTaskForm = ({ initialTask, users = [], onSubmit, onCancel }) => {
    const [task, setTask] = useState(initialTask || { title: "", description: "", dueDate: "", status: "ToDo", assignedUserId: "unassigned" });

    const handleChange = async (e) => {
        const { name, value } = e.target;
        setTask((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        onSubmit(task);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            
            <label className={labelClasses}>Title</label>
            <InputField className={inputClasses} name="title" placeholder="Task title" value={task.title} onChange={handleChange} required />

            <label className={labelClasses}>Description</label>
            <InputField className={inputClasses} name="description" placeholder="Task description" value={task.description} onChange={handleChange} />

            <label className={labelClasses}>Due Date</label>
            <InputField className={inputClasses} name="dueDate" placeholder="Task due date" value={task.dueDate} onChange={handleChange} type="date" />

            <label className={labelClasses}>Status</label>
            <SelectField
                className={inputClasses}
                name="status"
                value={task.status}
                onChange={handleChange}
                options={Object.entries(TaskItemStatus).map(([key, value]) => ({ key, label: value, value }))}
            />

            <label className={labelClasses}>Assigned User</label>
            <SelectField
                className={inputClasses}
                name="assignedUserId"
                value={task.assignedUserId || "unassigned"}
                onChange={handleChange}
                options={[
                    { key: "none", label: "Unassigned", value: "unassigned" },
                    ...users.map((user) => (
                        {key: user.id, label: user.email, value: user.id}))
                ]}
            />

            <div className="flex justify-end space-x-2 mt-2">
                <button
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    type="submit"
                >
                    Save
                </button>
                <button
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                    type="button"
                    onClick={onCancel}
                >
                    Cancel
                </button>
            </div>
        </form>
    )
};

export default EditTaskForm;