const TaskInfoFooter = ({ task }) => (
    <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
        <div>
            <span className="font-medium">Created by:</span> {task.createdByUserEmail || "-"}
        </div>
        <div>
            <span className="font-medium">Created at:</span> {task.createdAt || "-"}
        </div>
        <div>
            <span className="font-medium">Finished at:</span> {task.finishedAt || "-"}
        </div>
    </div>
);

export default TaskInfoFooter;