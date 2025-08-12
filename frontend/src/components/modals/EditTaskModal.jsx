import { Modal } from "react-bootstrap";
import EditTaskForm from "../forms/EditTaskForm";

const EditTaskModal = ({ show, task, users, onSave, onCancel }) => (
    <Modal show={show} onHide={onCancel}>
        <Modal.Header closeButton>
            <Modal.Title>{task?.id ? "Edit task" : "Create a task"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {task && (
                <EditTaskForm initialTask={task} users={users} onSubmit={onSave} onCancel={onCancel} />
            ) }
        </Modal.Body>
    </Modal>
);

export default EditTaskModal;
