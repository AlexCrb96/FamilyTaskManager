import React from "react";
import { FaSortUp, FaSortDown } from "react-icons/fa";

const ShowTasksForm = ({ tasks, onEdit, onDelete, onSort, sortConfig }) => {

    const renderSortArrow = (column) => {
        if (sortConfig.key !== column) {
            return null;
        }

        return sortConfig.direction === "asc" ? <FaSortUp className="inline ml-1" /> : <FaSortDown className = "inline ml-1" />;
    };

    return (
        <div className="w-full max-w-4xl overflow-x-auto bg-white rounded-2xl shadow-md p-4">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {["ID", "Title", "Description", "Due Date", "Status", "Assigned User", "Actions"].map((col, idx) => (
                            <th
                                className="px-4 py2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                                key={idx}
                                onClick={col === "Due Date" || col === "Status" || col === "Assigned User" ? () => onSort(col.toLowerCase().replace(" ","")) : null}
                            >
                                {col} {renderSortArrow(col.toLowerCase().replace(" ",""))}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {tasks.map((task) => (
                        <tr key={task.id}>
                            <td className="px-4 py-2">{task.id}</td>
                            <td className="px-4 py-2">{task.title}</td>
                            <td className="px-4 py-2">{task.description}</td>
                            <td className="px-4 py-2">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}</td>
                            <td className="px-4 py-2">{task.status}</td>
                            <td className="px-4 py-2">{task.assignedUserEmail || "Unassigned"}</td>
                            <td className="px-4 py-2 space-x-2">
                                <button
                                    className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                                    onClick={() => onEdit(task)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                    onClick={() => onDelete(task.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>        
    );
};

export default ShowTasksForm;