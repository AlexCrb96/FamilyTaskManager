import React from "react";

const ShowTasksForm = ({ tasks, users, onEdit, onDelete }) => {

    return (
        <table>
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Assigned User</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {tasks.map((task) => (
                    <tr key={task.id}>
                        <td>{task.title}</td>
                        <td>{task.description}</td>
                        <td>{task.dueDate}</td>
                        <td>{task.status}</td>
                        <td>{task.assignedUserEmail || "Unassigned"}</td>
                        <td>
                            <button onClick={() => onEdit(task)}>Edit</button>
                            <button onClick={() => onDelete(task.id)}>Delete</button>
                        </td>
                    </tr>
                )) }
            </tbody>
        </table>
    );
};

export default ShowTasksForm;