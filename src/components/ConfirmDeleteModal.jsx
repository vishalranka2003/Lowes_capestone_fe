import React from 'react';
import '../styles/ConfirmDeleteModal.css';

const ConfirmDeleteModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="confirm-modal-overlay">
      <div className="confirm-modal">
       {/* // <div className="modal-icon"></div> */}
        <h2>Delete Appliance?</h2>
        <p>This action is <strong>permanent</strong> and cannot be undone.</p>
        <div className="modal-buttons">
          <button className="btn cancel-btn" onClick={onCancel}>Cancel</button>
          <button className="btn delete-btn" onClick={onConfirm}>Yes, Delete</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
