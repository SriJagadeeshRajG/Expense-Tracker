import { useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import { FaEye, FaEyeSlash } from "react-icons/fa";

import API from "../services/authApi";
import toast from "react-hot-toast";
import AuthLayout from "../components/AuthLayout";

function ResetPassword() {

  const { token } = useParams();

  const navigate = useNavigate();

  const [password, setPassword] =
    useState("");

  const [confirmPassword,
    setConfirmPassword] =
    useState("");

  const [showPassword,
    setShowPassword] =
    useState(false);

  const [loading,
    setLoading] =
    useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {

      setLoading(true);

      await API.post(
        `/reset-password/${token}`,
        {
          password,
        }
      );

      toast.success(
        "Password reset successfully!"
      );

      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        "Reset failed"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <AuthLayout
      title="🔑 Reset Password"
      subtitle="Create a strong new password for your account."
    >

      <form
        className="auth-form"
        onSubmit={handleSubmit}
      >

        {/* New Password */}

        <div className="password-container">

          <input
            type={
              showPassword
                ? "text"
                : "password"
            }
            placeholder="New Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          <button
            type="button"
            className="show-btn"
            onClick={() =>
              setShowPassword(!showPassword)
            }
          >
            {showPassword
              ? <FaEyeSlash />
              : <FaEye />}
          </button>

        </div>

        {/* Confirm Password */}

        <div className="password-container">

          <input
            type={
              showPassword
                ? "text"
                : "password"
            }
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
            }
            required
          />

          <button
            type="button"
            className="show-btn"
            onClick={() =>
              setShowPassword(!showPassword)
            }
          >
            {showPassword
              ? <FaEyeSlash />
              : <FaEye />}
          </button>

        </div>

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Resetting..."
            : "Reset Password"}
        </button>

        <p
          style={{
            marginTop: "20px",
            textAlign: "center",
          }}
        >
          <Link to="/">
            ← Back to Login
          </Link>
        </p>

      </form>

    </AuthLayout>

  );

}

export default ResetPassword;