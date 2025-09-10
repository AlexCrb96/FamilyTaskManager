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
        <form onSubmit={handleSubmit}>

            <TaskBody task={task} users={users} editable onChange={handleChange} />
            <ActionButtonsPair
                primaryLabel="Save"
                primaryType="submit"
                primaryColor="success"
                secondaryLabel="Cancel"
                onSecondaryClick={onCancel}
            />
        </form>
    )
};

export default EditTaskForm;