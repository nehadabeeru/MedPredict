import React from 'react';
import '../styles/modal.css';

const ConfirmationModal = ({ isOpen, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <p>{message}</p>
                <div className="modal-actions">
                    <button onClick={onConfirm} className="confirm-btn">Yes</button>
                    <button onClick={onCancel} className="cancel-btn">No</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
