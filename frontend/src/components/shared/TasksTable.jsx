import React, { useState } from "react";
import { FaSortUp, FaSortDown } from "react-icons/fa";

import MarkdownRenderer from "../../utils/markdownUtils";

const MAX_DESCRIPTION_LENGTH = 150;

const TasksTable = ({ tasks, onView, onDelete, onSort, sortConfig }) => {
    const [expandedRows, setExpandedRows] = useState({});

    const columnSortKeys = {
        "Due Date": "dueDate",
        "Status": "status",
        "Assigned User": "assignedUserEmail"
    };

    const renderSortArrow = (column) => {
        if (sortConfig.key !== column) {
            return null;
        }

        return sortConfig.direction === "asc" ? <FaSortUp className="inline ml-1" /> : <FaSortDown className = "inline ml-1" />;
    };

    const toggleRow = (id) => {
        setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const renderDescription = (task) => {
        const fullText = task.description;
        const isExpanded = expandedRows[task.id];

        if (!fullText) return null;

        const displayedText = isExpanded ? fullText : fullText.slice(0, MAX_DESCRIPTION_LENGTH);

        return (
            <div>
                <MarkdownRenderer markdown={displayedText} />
                {fullText.length > MAX_DESCRIPTION_LENGTH && (
                    <button
                        className="text-xs mt-1 hover:underline"
                        onClick={() => toggleRow(task.id)}
                    >
                        {isExpanded ? "Show less" : "Show more"}
                    </button>
                )}               
            </div>
        );
    };

    return (
        <div className="w-full overflow-x-auto bg-white rounded-2xl shadow-md p-4">
            <table className="min-w-full table-auto divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {["ID", "Title", "Description", "Due Date", "Status", "Assigned User", "Actions"].map((col, idx) => (
                            <th
                                className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                                key={idx}
                                onClick={columnSortKeys[col] ? () => onSort(columnSortKeys[col]) : null}
                            >
                                {col} {renderSortArrow(columnSortKeys[col])}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {tasks.map((task) => (
                        <tr key={task.id}>
                            <td className="px-4 py-2">{task.id}</td>
                            <td className="px-4 py-2">{task.title}</td>
                            <td className="px-4 py-2">{renderDescription(task)}</td>
                            <td className="px-4 py-2">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}</td>
                            <td className="px-4 py-2">{task.status}</td>
                            <td className="px-4 py-2">{task.assignedUserEmail || "Unassigned"}</td>
                            <td className="px-4 py-2">
                                <div className="flex space-x-2 justify-start">
                                    <button
                                        className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                                        onClick={() => onView(task)}
                                    >
                                        View Task
                                    </button>
                                    <button
                                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                        onClick={() => onDelete(task.id)}
                                    >
                                        Delete
                                    </button>
                                </div>                                
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>        
    );
};

export default TasksTable;