import React from "react";
import FilterBarForm from "./FilterBarForm";

const ShowTasksForm = ({
    tasks,
    users,
    onEdit,
    onDelete,
    onCreate,
    searchTerm,
    onSearchChange,
    onSearchSubmit,
 }) => {

    return (
        <>
            <FilterBarForm
                onCreate={onCreate}
                searchTerm={searchTerm}
                onSearchChange={onSearchChange}
                onSearchSubmit={onSearchSubmit}
            />
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
        </>

    );
};

export default ShowTasksForm;