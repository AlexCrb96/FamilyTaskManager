import React, { useState } from "react";
import ActionButtonsPair from "../shared/ActionButtonsPair";
import TaskBody from "../shared/TaskBody";

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