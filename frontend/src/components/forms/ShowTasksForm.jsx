import React from "react";
import { FaSortUp, FaSortDown } from "react-icons/fa";

const ShowTasksForm = ({ tasks, onEdit, onDelete, onSort, sortConfig }) => {

    const renderSortArrow = (column) => {
        if (sortConfig.key !== column) {
            return null;
        }

        return sortConfig.direction === "asc" ? <FaSortUp/> : <FaSortDown/>;
    };

    return (
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th onClick={() => onSort("dueDate")} style={{ cursor: "pointer" }}>Due Date {renderSortArrow("dueDate")}</th>
                    <th onClick={() => onSort("status")} style={{ cursor: "pointer" }}>Status {renderSortArrow("status")}</th>
                    <th onClick={() => onSort("assignedUserEmail")} style={{ cursor: "pointer" }}>Assigned User {renderSortArrow("assignedUserEmail")}</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {tasks.map((task) => (
                    <tr key={task.id}>
                        <td>{task.id}</td>
                        <td>{task.title}</td>
                        <td>{task.description}</td>
                        <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}</td>
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