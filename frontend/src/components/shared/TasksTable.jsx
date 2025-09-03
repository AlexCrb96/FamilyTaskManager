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

        return sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />;
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
                        onClick={() => toggleRow(task.id)}
                    >
                        {isExpanded ? "Show less" : "Show more"}
                    </button>
                )}               
            </div>
        );
    };

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        {["ID", "Title", "Description", "Due Date", "Status", "Assigned User", "Actions"].map((col, idx) => (
                            <th
                                key={idx}
                                onClick={columnSortKeys[col] ? () => onSort(columnSortKeys[col]) : null}
                            >
                                {col} {renderSortArrow(columnSortKeys[col])}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task) => (
                        <tr key={task.id}>
                            <td>{task.id}</td>
                            <td>{task.title}</td>
                            <td>{renderDescription(task)}</td>
                            <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}</td>
                            <td>{task.status}</td>
                            <td>{task.assignedUserEmail || "Unassigned"}</td>
                            <td>
                                <div>
                                    <button
                                        onClick={() => onView(task)}
                                    >
                                        View Task
                                    </button>
                                    <button
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