import RichTextEditor from "./RichTextEditor";
import TaskInfoFooter from "./TaskInfoFooter";
import TaskItemStatus from "../../enums/TaskItemStatus";
import MarkdownRenderer from "../../utils/markdownUtils";

const TaskBody = ({ task, users = [], editable = false, onChange }) => {
    if (!task) return null;

    return (
        <div>

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
                            options={Object.entries(TaskItemStatus).map(([key, value]) => ({
                                key,
                                label: value,
                                value
                            }))}
                        />
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
                            value={task.description}
                            onChange={(val) => onChange({ target: { name: "description", value: val } })}
                        />
                        : <MarkdownRenderer markdown={task.description} />
                    }
                </div>

                <div>
                    <label>Progress</label>
                    {editable
                        ? <RichTextEditor
                            value={task.progress}
                            onChange={(val) => onChange({ target: { name: "progress", value: val } })}
                        />
                        : <div dangerouslySetInnerHTML={{ __html: task.progress }} />
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
                            options={[
                                { key: "none", label: "Unassigned", value: "unassigned" },
                                ...users.map(u => ({ key: u.id, label: u.email, value: u.id }))
                            ]}
                        />
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