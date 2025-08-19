import { Modal } from "react-bootstrap";
import EditTaskForm from "../forms/EditTaskForm";

const EditTaskModal = ({ show, task, users, onSave, onCancel }) => (
    <Modal
        show={show}
        onHide={onCancel}
        centered
        dialogClassName="max-w-md w-full"
    >
        <div className="bg-white rounded-2xl shadow-md p-6">
            <Modal.Header
                className="border-b-0 p-0 mb-4"
                closeButton
            >
                <h2 className="text-xl font-bold text-gray-900">
                    {task?.id ? "Edit task" : "Create a task"}
                </h2>
            </Modal.Header>
            <Modal.Body className="p-0">
                {task && (
                    <EditTaskForm initialTask={task} users={users} onSubmit={onSave} onCancel={onCancel} />
                )}
            </Modal.Body>
        </div>        
    </Modal>
);

export default EditTaskModal;
