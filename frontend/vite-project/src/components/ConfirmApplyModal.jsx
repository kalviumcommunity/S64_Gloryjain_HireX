import React from 'react';

const ConfirmApplyModal = ({ open, onClose, onConfirm, message }) => {
  if (!open) return null;
  return (
    <div className="confirm-modal-overlay">
      <div className="confirm-modal">
        <div className="confirm-modal-message">{message || 'Are you sure you want to apply?'}</div>
        <div className="confirm-modal-actions">
          <button className="confirm-modal-cancel" onClick={onClose}>Cancel</button>
          <button className="confirm-modal-confirm" onClick={onConfirm}>Continue</button>
        </div>
      </div>
      <style>{`
        .confirm-modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 3000;
        }
        .confirm-modal {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.12);
          padding: 32px 32px 24px 32px;
          min-width: 320px;
          max-width: 90vw;
          text-align: center;
          animation: fadeIn 0.2s;
        }
        .confirm-modal-message {
          font-size: 20px;
          font-weight: 600;
          color: #22223b;
          margin-bottom: 28px;
        }
        .confirm-modal-actions {
          display: flex;
          justify-content: center;
          gap: 18px;
        }
        .confirm-modal-cancel, .confirm-modal-confirm {
          padding: 10px 28px;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 500;
          border: none;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        .confirm-modal-cancel {
          background: #f3f4f6;
          color: #6b7280;
        }
        .confirm-modal-cancel:hover {
          background: #e5e7eb;
        }
        .confirm-modal-confirm {
          background: #8b5cf6;
          color: #fff;
        }
        .confirm-modal-confirm:hover {
          background: #7c3aed;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default ConfirmApplyModal; 