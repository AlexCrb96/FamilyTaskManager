import "../../styles/components/shared/TaskInfoFooter.css";

const TaskInfoFooter = ({ task }) => (
    <div className="task-info-footer">
        <div>
            <span>Created by:</span> {task.createdByUserEmail || "-"}
        </div>
        <div>
            <span>Created at:</span> {task.createdAt || "-"}
        </div>
        <div>
            <span>Finished at:</span> {task.finishedAt || "-"}
        </div>
    </div>
);

export default TaskInfoFooter;