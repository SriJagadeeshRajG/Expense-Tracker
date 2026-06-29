import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authAPI from "../services/authApi";
import "../styles/Auth.css";
import AuthLayout from "../components/AuthLayout";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await authAPI.post("/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userName", response.data.name);
      localStorage.setItem("userEmail", response.data.email);

      navigate("/dashboard");
      window.location.reload();

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Login Failed"
      );
    }
  };

  return (
  <AuthLayout
    title="🔐 Login"
    subtitle="Welcome back! Sign in to continue managing your expenses."
  >
    <form onSubmit={handleLogin}>

      <input
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <div className="password-container">

        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="button"
          className="show-btn"
          onClick={() =>
            setShowPassword(!showPassword)
          }
        >
          {showPassword ? "🙈" : "👁️"}
        </button>

      </div>

      <div className="forgot-password">
        <span
          onClick={() =>
            navigate("/forgot-password")
          }
        >
          Forgot Password?
        </span>
      </div>

      <button type="submit">
        Login
      </button>

      <p>
        Don't have an account?{" "}
        <Link to="/register">
          Register
        </Link>
      </p>

    </form>
  </AuthLayout>
);
}

export default Login;