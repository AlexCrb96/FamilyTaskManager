import { Modal } from "react-bootstrap";

import TaskBody from "../shared/TaskBody";
import ActionButtonsPair from "../shared/ActionButtonsPair";

const ViewTaskModal = ({ show, task, onClose, onEdit }) => (
    <Modal
        show={show}
        onHide={onClose}
        centered
        size="xl"
    >
        <div>
            <Modal.Header closeButton>
                <h2>Task ID: {task?.id}</h2>
            </Modal.Header>

            <Modal.Body>
                <TaskBody task={task} editable={false}/>
            </Modal.Body>

            <Modal.Footer>
                <ActionButtonsPair
                    primaryLabel="Edit"
                    onPrimaryClick={() => onEdit(task)}
                    secondaryLabel="Close"
                    onSecondaryClick={onClose}
                />
            </Modal.Footer>
        </div>        
    </Modal>
);

export default ViewTaskModal;