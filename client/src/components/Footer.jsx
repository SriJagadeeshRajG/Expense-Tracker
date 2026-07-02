import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer">

      <h3>💰 Expense Tracker</h3>

      <p>
        Manage your finances smarter,
        save more, spend better.
      </p>

      <div className="footer-tech">
        <span>⚛ React</span>
        <span>🚀 Node.js</span>
        <span>🍃 MongoDB</span>
        <span>🔐 JWT</span>
      </div>

      <p className="copyright">
        © 2026 Sri Jagadeesh Raj G • All Rights Reserved
      </p>

    </footer>
  );
}

export default Footer;