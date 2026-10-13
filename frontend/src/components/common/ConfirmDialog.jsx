import {useEffect, useRef} from 'react';

const ConfirmDialog = ({isOpen, title, children, confirmLabel, onConfirm, onCancel}) => {
    const dialogRef = useRef(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        if (isOpen && !dialog.open) dialog.showModal();
        if (!isOpen && dialog.open) dialog.close();
    }, [isOpen]);

    return (
        <dialog ref={dialogRef} className="modal modal--confirm" onCancel={onCancel}>
            <div className="modal__body">
                <h2>{title}</h2>
                <div className="modal__copy">{children}</div>
                <div className="button-row">
                    <button className="button button--warning" type="button" onClick={onConfirm}>
                        {confirmLabel}
                    </button>
                    <button className="button button--secondary" type="button" onClick={onCancel}>
                        Cancel
                    </button>
                </div>
            </div>
        </dialog>
    );
};

export default ConfirmDialog;
