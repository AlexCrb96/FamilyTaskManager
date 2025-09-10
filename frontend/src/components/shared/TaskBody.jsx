import "../../styles/components/shared/TaskBody.css";

import RichTextEditor from "./RichTextEditor";
import TaskInfoFooter from "./TaskInfoFooter";
import TaskItemStatus from "../../enums/TaskItemStatus";
import MarkdownRenderer from "../../utils/markdownUtils";

const TaskBody = ({ task, users = [], editable = false, onChange }) => {
    if (!task) return null;

    return (
        <div className="task-body">

            {/* Title + Status */}
            <div>
                <div>
                    <label>Title</label>
                    {editable
                        ? <input value={task.title} onChange={onChange} name="title" />
                        : <div>{task.title}</div>
                    }
                </div>

                <div>
                    <label>Status</label>
                    {editable
                        ? <select
                            name="status"
                            value={task.status}
                            onChange={onChange}
                        >
                            {Object.entries(TaskItemStatus).map(([key, value]) => (
                                <option key={key} value={value}>
                                    {value}
                                </option>
                            ))}
                        </select>
                        : <div>{task.status}</div>
                    }
                </div>
            </div>

            {/* Description + Progress */}
            <div>
                <div>
                    <label>Description</label>
                    {editable
                        ? <RichTextEditor
                            className="rich-text-editor"
                            value={task.description}
                            onChange={(val) => onChange({ target: { name: "description", value: val } })}
                        />
                        : <MarkdownRenderer className="markdown-renderer" markdown={task.description} />
                    }
                </div>

                <div>
                    <label>Progress</label>
                    {editable
                        ? <RichTextEditor
                            value={task.progress}
                            onChange={(val) => onChange({ target: { name: "progress", value: val } })}
                        />
                        : <MarkdownRenderer className="markdown-renderer" markdown={task.progress} />
                    }
                </div>
            </div>

            {/* Assigned User + Due Date */}
            <div>
                <div>
                    <label>Assigned User</label>
                    {editable
                        ? <select
                            name="assignedUserId"
                            value={task.assignedUserId || "unassigned"}
                            onChange={onChange}
                        >
                            <option value="unassigned">Unassigned</option>
                            {users.map(u => (
                                <option key={u.id} value={u.id}>
                                    {u.email}
                                </option>
                            ))}
                        </select>
                        : <div>{task.assignedUserEmail || "Unassigned"}</div>
                    }
                </div>

                <div>
                    <label>Due Date</label>
                    {editable
                        ? <input
                            value={task.dueDate}
                            onChange={onChange}
                            name="dueDate"
                            type="date"
                        />
                        : <div>{task.dueDate || "No Due Date"}</div>
                    }
                </div>
            </div>

            {/* Read-only labels */}
            <TaskInfoFooter task={task} />
        </div>
    );
};

export default TaskBody;