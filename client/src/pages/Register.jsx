import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authAPI from "../services/authApi";
import "../styles/Auth.css";
import AuthLayout from "../components/AuthLayout";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      alert("Enter a valid email");
      return;
    }

    if (password.length < 6) {
      alert(
        "Password must be at least 6 characters"
      );
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await authAPI.post("/register", {
        name,
        email,
        password,
      });

      alert("Registered Successfully");

      navigate("/");

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Registration Failed"
      );
    }
  };

  return (
    <AuthLayout
      title="📝 Create Account"
      subtitle="Start tracking your expenses professionally and manage your finances smarter."
    >
      <form
        className="auth-form"
        onSubmit={handleRegister}
      >

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          required
        />

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          required
        />

        <div className="password-container">

          <input
            type={
              showPassword
                ? "text"
                : "password"
            }
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            required
          />

          <button
            type="button"
            className="show-btn"
            onClick={() =>
              setShowPassword(
                !showPassword
              )
            }
          >
            {showPassword
              ? "🙈"
              : "👁️"}
          </button>

        </div>

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

        <button type="submit">
          Create Account
        </button>

        <p>
          Already have an account?{" "}
          <Link to="/">
            Login
          </Link>
        </p>

      </form>
    </AuthLayout>
  );
}

export default Register;