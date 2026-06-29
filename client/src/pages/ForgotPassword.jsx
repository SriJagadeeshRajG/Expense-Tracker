import { useState } from "react";
import { Link } from "react-router-dom";
import authAPI from "../services/authApi";
import toast from "react-hot-toast";
import "../styles/Auth.css";
import AuthLayout from "../components/AuthLayout";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await authAPI.post("/forgot-password", {
        email,
      });

      toast.success(res.data.message);
      setEmail("");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
  <AuthLayout
    title="📧 Forgot Password"
    subtitle="Enter your registered email. We'll send you a secure password reset link."
  >

    <form onSubmit={handleSubmit}>

      <input
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
        required
      />

      <button
        type="submit"
        disabled={loading}
      >
        {loading
          ? "Sending..."
          : "Send Reset Link"}
      </button>

      <p>
        Remember your password?{" "}
        <Link to="/">
          Login
        </Link>
      </p>

    </form>

  </AuthLayout>
);
}

export default ForgotPassword;