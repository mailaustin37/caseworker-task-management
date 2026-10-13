import {useEffect, useRef} from 'react';
import TaskForm from './TaskForm';

const TaskPanel = ({isOpen, task, isSaving, onSave, onClose}) => {
    const dialogRef = useRef(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        if (isOpen && !dialog.open) dialog.showModal();
        if (!isOpen && dialog.open) dialog.close();
    }, [isOpen]);

    return (
        <dialog ref={dialogRef} className="modal modal--task" onCancel={onClose}>
            <div className="modal__header">
                <div>
                    <span className="section-label">Casework task</span>
                    <h2>{task ? 'Edit task' : 'Create a task'}</h2>
                </div>
                <button className="close-button" type="button" onClick={onClose} aria-label="Close task form">
                    <span aria-hidden="true">×</span>
                </button>
            </div>
            <div className="modal__body">
                <TaskForm task={task} isSaving={isSaving} onSave={onSave} onCancel={onClose} />
            </div>
        </dialog>
    );
};

export default TaskPanel;
