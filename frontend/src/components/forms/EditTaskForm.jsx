import React, { useState } from "react";
import TaskInfoFooter from "../shared/TaskInfoFooter";
import ActionButtonsPair from "../shared/ActionButtonsPair";
import TaskBody from "../shared/TaskBody";


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

            <TaskBody task={task} users={users} editable onChange={handleChange} />
            {/* Buttons */}
            <ActionButtonsPair
                primaryLabel="Save"
                primaryType="submit"
                primaryColor="bg-green-600 hover:bg-green-700 text-white"
                secondaryLabel="Cancel"
                onSecondaryClick={onCancel}
            />
        </form>
    )
};

export default EditTaskForm;