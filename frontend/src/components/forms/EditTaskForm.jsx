import React, { useState } from "react";
import { InputField, SelectField } from "./FormFields";
import TaskItemStatus from "../../enums/TaskItemStatus";
import TaskDescriptionEditor from "../editors/TaskDescriptionEditor";

const inputClasses =
    "block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";
const labelClasses = "text-sm font-medium text-gray-700";

const EditTaskForm = ({ initialTask, users = [], onSubmit, onCancel }) => {
    const [task, setTask] = useState(
        initialTask ||
        {
            title: "",
            description: "",
            progress: "",
            dueDate: "",
            status: "ToDo",
            assignedUserId: "unassigned",
            createdBy: "",
            createdAt: null,
            finishedAt: null
        });

    const handleChange = async (e) => {
        const { name, value } = e.target;
        setTask((prev) => ({ ...prev, [name]: value }));
    };

    const handleDescriptionChange = (value) => {
        setTask((prev) => ({ ...prev, description: value }));
    };

    const handleProgressChange = (value) => {
        setTask((prev) => ({ ...prev, progress: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        onSubmit(task);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">

            {/* Title + Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className={labelClasses}>Title</label>
                    <InputField className={inputClasses} name="title" placeholder="Task title" value={task.title} onChange={handleChange} required />
                </div>

                <div>
                    <label className={labelClasses}>Status</label>
                    <SelectField
                        className={inputClasses}
                        name="status"
                        value={task.status}
                        onChange={handleChange}
                        options={Object.entries(TaskItemStatus).map(([key, value]) => ({ key, label: value, value }))}
                    />
                </div>
            </div>
            
            {/* Description + Progress */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                    <label className={labelClasses}>Description</label>
                    <TaskDescriptionEditor
                        className="min-h-[275px] max-h-[450px] h-full"
                        value={task.description}
                        onChange={handleDescriptionChange} />
                </div>

                <div className="flex flex-col">
                    <label className={labelClasses}>Progress</label>
                    <TaskDescriptionEditor
                        className="min-h-[275px] max-h-[450px] h-full"
                        value={task.progress}
                        onChange={handleProgressChange} />
                </div>
            </div>

            {/* Assigned user + Due date*/ }
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className={labelClasses}>Assigned User</label>
                    <SelectField
                        className={inputClasses}
                        name="assignedUserId"
                        value={task.assignedUserId || "unassigned"}
                        onChange={handleChange}
                        options={[
                            { key: "none", label: "Unassigned", value: "unassigned" },
                            ...users.map((user) => (
                                { key: user.id, label: user.email, value: user.id }))
                        ]}
                    />
                </div>

                <div>
                    <label className={labelClasses}>Due Date</label>
                    <InputField className={inputClasses} name="dueDate" placeholder="Task due date" value={task.dueDate} onChange={handleChange} type="date" />
                </div>
            </div>
           
            {/* Read-only lables */}
            <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
                <div>
                    <span className="font-medium">Created by:</span> {task.createdByUserEmail || "-"}
                </div>
                <div>
                    <span className="font-medium">Created at:</span> {task.createdAt || "-"}
                </div>
                <div>
                    <span className="font-medium">Finished at:</span> {task.finishedAt || "-"}
                </div>
            </div>

            {/* Buttons */}
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