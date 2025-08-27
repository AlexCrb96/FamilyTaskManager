import { InputField, SelectField, inputClasses } from "./InputFields";
import TaskDescriptionEditor from "./TaskDescriptionEditor";
import TaskInfoFooter from "./TaskInfoFooter";
import TaskItemStatus from "../../enums/TaskItemStatus";

const TaskBody = ({ task, users = [], editable = false, onChange }) => {
    if (!task) return null;

    return (
        <div className="space-y-6">

            {/* Title + Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="flex flex-col">
                    <label className="font-semibold mb-1">Title</label>
                    {editable
                        ? <InputField value={task.title} onChange={onChange} name="title" />
                        : <div>{task.title}</div>
                    }
                </div>

                <div className="flex flex-col">
                    <label className="font-semibold mb-1">Status</label>
                    {editable
                        ? <SelectField
                            className={inputClasses}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="flex flex-col h-full">
                    <label className="font-semibold mb-1">Description</label>
                    {editable
                        ? <TaskDescriptionEditor
                            className="max-h-[450px]"
                            value={task.description}
                            onChange={(val) => onChange({ target: { name: "description", value: val } })}
                        />
                        : <div dangerouslySetInnerHTML={{ __html: task.description }} />
                    }
                </div>

                <div className="flex flex-col h-full">
                    <label className="font-semibold mb-1">Progress</label>
                    {editable
                        ? <TaskDescriptionEditor
                            className="max-h-[450px]"
                            value={task.progress}
                            onChange={(val) => onChange({ target: { name: "progress", value: val } })}
                        />
                        : <div dangerouslySetInnerHTML={{ __html: task.progress }} />
                    }
                </div>
            </div>

            {/* Assigned User + Due Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                <div className="flex flex-col">
                    <label className="font-semibold mb-1">Assigned User</label>
                    {editable
                        ? <SelectField
                            className={inputClasses}
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

                <div className="flex flex-col">
                    <label className="font-semibold mb-1">Due Date</label>
                    {editable
                        ? <InputField
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