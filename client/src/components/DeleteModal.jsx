import Modal from "react-modal";
import "../styles/DeleteModal.css";

Modal.setAppElement("#root");

function DeleteModal({
  isOpen,
  onClose,
  onDelete,
  expenseTitle,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="delete-modal"
      overlayClassName="delete-overlay"
    >
      <div className="delete-icon">
        🗑️
      </div>

      <h2>Delete Expense</h2>

      <p>
        Are you sure you want to delete
      </p>

      <h3>"{expenseTitle}"</h3>

      <p className="warning">
        This action cannot be undone.
      </p>

      <div className="delete-buttons">

        <button
          className="cancel-btn"
          onClick={onClose}
        >
          Cancel
        </button>

        <button
          className="delete-btn-modal"
          onClick={onDelete}
        >
          Delete
        </button>

      </div>
    </Modal>
  );
}

export default DeleteModal;