import { Modal } from "react-bootstrap";
import EditTaskForm from "../forms/EditTaskForm";

const EditTaskModal = ({ show, task, users, onSave, onCancel }) => (
    <Modal
        show={show}
        onHide={onCancel}
        centered
    >
        <div>
            <Modal.Header
                closeButton
            >
                <h2>
                    {task?.id ? `Edit Task ID: ${task.id}` : "Create a task"}
                </h2>
            </Modal.Header>
            <Modal.Body>
                {task && (
                    <EditTaskForm initialTask={task} users={users} onSubmit={onSave} onCancel={onCancel} />
                )}
            </Modal.Body>
        </div>        
    </Modal>
);

export default EditTaskModal;
