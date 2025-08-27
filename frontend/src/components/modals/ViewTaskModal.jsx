import { Modal } from "react-bootstrap";
import TaskBody from "../shared/TaskBody";
import ActionButtonsPair from "../shared/ActionButtonsPair";

const ViewTaskModal = ({ show, task, onClose, onEdit }) => (
    <Modal
        show={show}
        onHide={onClose}
        centered
        size="xl"
        dialogClassName="!max-w-[1300px] w-full"
    >
        <div className="bg-white rounded-2xl shadow-md p-6">
            <Modal.Header className="border-b-0 p-0 mb-4" closeButton>
                <h2 className="text-xl font-bold text-gray-900">Task ID: {task?.id}</h2>
            </Modal.Header>

            <Modal.Body className="p-0">
                <TaskBody task={task} editable={false}/>
            </Modal.Body>

            <Modal.Footer className="border-t-0 pt-4">
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