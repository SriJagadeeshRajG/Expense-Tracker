import {
  FaChartLine,
  FaWallet,
  FaBullseye,
  FaShieldAlt,
} from "react-icons/fa";

import "../styles/Auth.css";

function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="auth-container">
      {/* LEFT SIDE */}

      <div className="auth-left">
        <div className="hero-content">
          <h1>💰 Expense Tracker</h1>

          <p>
            Take complete control of your finances with
            beautiful analytics, smart budgeting and
            powerful expense management.
          </p>

          <div className="feature-list">

            <div className="feature-card">
              <FaWallet className="feature-icon" />

              <div>
                <h4>Expense Tracking</h4>

                <p>
                  Record and organize every expense with ease.
                </p>
              </div>
            </div>

            <div className="feature-card">
              <FaChartLine className="feature-icon" />

              <div>
                <h4>Analytics</h4>

                <p>
                  Visualize your spending using beautiful charts.
                </p>
              </div>
            </div>

            <div className="feature-card">
              <FaBullseye className="feature-icon" />

              <div>
                <h4>Budget Goals</h4>

                <p>
                  Set monthly limits and stay on track.
                </p>
              </div>
            </div>

            <div className="feature-card">
              <FaShieldAlt className="feature-icon" />

              <div>
                <h4>Secure Storage</h4>

                <p>
                  Your financial information is encrypted and safe.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}

      <div className="auth-right">
        <div className="auth-card">

          <h2>{title}</h2>

          <p className="auth-subtitle">
            {subtitle}
          </p>

          {children}

        </div>
      </div>
    </div>
  );
}

export default AuthLayout;