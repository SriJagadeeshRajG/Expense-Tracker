import { useState } from "react";
import { changePassword } from "../services/authApi";
import "../styles/ChangePasswordModal.css";

function ChangePasswordModal({ open, onClose }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!currentPassword || !newPassword) {
      return alert("Please fill all fields");
    }

    if (newPassword !== confirmPassword) {
      return alert("Passwords do not match");
    }

    try {
      setLoading(true);

      await changePassword({
        currentPassword,
        newPassword,
      });

      alert("Password updated successfully");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      onClose();

    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Failed to change password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="password-overlay">

      <div className="password-modal">

        <h2>🔒 Change Password</h2>

        <p>
          Keep your account secure by updating
          your password.
        </p>

        <input
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) =>
            setCurrentPassword(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) =>
            setNewPassword(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(e.target.value)
          }
        />

        <div className="password-actions">

          <button
            className="cancel-password-btn"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="save-password-btn"
            onClick={handleSubmit}
          >
            {loading
              ? "Updating..."
              : "Change Password"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default ChangePasswordModal;