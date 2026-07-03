import { useState, useEffect } from "react";
import ExpenseForm from "../components/ExpenseForm";
import Summary from "../components/Summary";
import ExpenseList from "../components/ExpenseList";
import ExpenseChart from "../components/ExpenseChart";
import ExpenseBarChart from "../components/ExpenseBarChart";
import RecentTransactions from "../components/RecentTransactions";
import "../styles/App.css";
import ExpenseTrendChart from "../components/ExpenseTrendChart";
import BudgetCard from "../components/BudgetCard";
import { motion } from "framer-motion";
import QuickStats from "../components/QuickStats";
import InsightsCard from "../components/InsightsCard";
import MonthlyComparison from "../components/MonthlyComparison";
import { updateUsername } from "../services/authApi";
import "../styles/Settings.css";
import ChangePasswordModal from "../components/ChangePasswordModal";
import budgetAPI from "../services/budgetApi";


import {
  FaHome,
  FaWallet,
  FaChartPie,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

function Dashboard() {

  const userName =
    localStorage.getItem("userName");

  const userEmail =
    localStorage.getItem("userEmail");

  const currentHour = new Date().getHours();

  const [refresh, setRefresh] = useState(false);

  const [editingExpense, setEditingExpense] =
    useState(null);

  const [activePage, setActivePage] =
    useState("home");

  const [newName, setNewName] =
    useState(userName || "");

  const [loadingName, setLoadingName] =
    useState(false);
  const [budget, setBudget] = useState(5000);
  const [showPasswordModal, setShowPasswordModal] =
  useState(false);

  const theme = "dark";
  const handleUpdateName = async () => {
  try {
    setLoadingName(true);

    const res = await updateUsername(newName);

    localStorage.setItem("userName", res.data.name);

    alert("Username updated successfully");

    localStorage.setItem("userName", res.data.name);
setNewName(res.data.name);

alert("Username updated successfully");
  } catch (err) {
    alert(err.response?.data?.message || "Update failed");
  } finally {
    setLoadingName(false);
  }
};

let greeting = "";
let greetingIcon = "";

if (currentHour < 12) {
  greeting = "Good Morning";
  greetingIcon = "☀️";
}
else if (currentHour < 17) {
  greeting = "Good Afternoon";
  greetingIcon = "🌤️";
}
else {
  greeting = "Good Evening";
  greetingIcon = "🌙";
}

useEffect(() => {

  document.body.className = "dark-theme";

  const fetchBudget = async () => {

    try{

      const res = await budgetAPI.get("/");

      setBudget(res.data.amount);

    }catch(err){

      console.log(err);

    }

  };

  fetchBudget();

},[]);

  const refreshExpenses = () => {
    setRefresh((prev) => !prev);
  };

  return (
    <div className="app-layout">
      <div className="sidebar">
        <div className="sidebar-logo">

  <div className="logo-icon">
    💰
  </div>

  <div>

    <h2>Expense Tracker</h2>

    <p>Personal Finance</p>

  </div>

</div>

        <div className="user-profile">
          <div className="user-avatar">
            {userName
              ? userName.charAt(0).toUpperCase()
              : "U"}
          </div>

          <h3>
            {userName || "User"}
          </h3>

          <p className="user-role">
  Expense Dashboard User
</p>

<div className="online-status">

  <span className="online-dot"></span>

  Online

</div>
        </div>

        <ul>

  <li
    className={activePage === "home" ? "active-menu" : ""}
    onClick={() => setActivePage("home")}
  >
    <FaHome />
    <span>Dashboard</span>
  </li>

  <li
    className={activePage === "expenses" ? "active-menu" : ""}
    onClick={() => setActivePage("expenses")}
  >
    <FaWallet />
    <span>Expenses</span>
  </li>

  <li
    className={activePage === "analytics" ? "active-menu" : ""}
    onClick={() => setActivePage("analytics")}
  >
    <FaChartPie />
    <span>Analytics</span>
  </li>

  <li
    className={activePage === "settings" ? "active-menu" : ""}
    onClick={() => setActivePage("settings")}
  >
    <FaCog />
    <span>Settings</span>
  </li>

</ul>

<div className="logout-container">

  <div
    className="logout-btn"
    onClick={() => {
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      window.location.href = "/";
    }}
  >
    <FaSignOutAlt />
    <span>Logout</span>
  </div>

</div>

</div>   {/* <-- Close Sidebar Here */}

<div className="main-content">

        {/* HOME */}

{activePage === "home" && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.4 }}
  >

    {/* Welcome Card */}

    <motion.div
      className="welcome-card"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        ease: "easeOut",
      }}
    >

      <div className="welcome-left">

        <h1>
          {greetingIcon} {greeting},
          <br />
          <span>{userName || "User"}</span>
        </h1>

        <p>
          Manage your expenses,
          stay within budget,
          and make smarter financial decisions.
        </p>

      </div>

      <div className="welcome-right">

  <div className="today-card">

    <h3>💰 Monthly Budget</h3>

    <h1>₹{budget}</h1>

    <hr />

    <h3 style={{marginTop:"18px"}}>

      📅 Today

    </h3>

    <p>

      {new Date().toLocaleDateString(
        "en-GB",
        {
          weekday:"long",
          day:"numeric",
          month:"long",
          year:"numeric"
        }
      )}

    </p>

    <div className="hero-note">

      Track every expense.
      Stay within budget.

    </div>

  </div>

</div>

    </motion.div>

    {/* Quick Stats */}

    <QuickStats refresh={refresh} />

    {/* Summary */}

    <Summary refresh={refresh} />
    

    {/* Dashboard Grid */}

    <div className="dashboard-row">

      <BudgetCard refresh={refresh} />

      <RecentTransactions refresh={refresh} />

    </div>

    <div className="dashboard-row">

      <ExpenseTrendChart refresh={refresh} />

      <ExpenseChart refresh={refresh} />

      

    </div>

  </motion.div>
)}
        {/* EXPENSES */}

        {activePage === "expenses" && (
          <>
            <div className="expense-page-header">

  <h1>Expenses</h1>

  <div className="export-buttons">
    

   
  </div>

</div>

            <ExpenseForm
              refreshExpenses={refreshExpenses}
              editingExpense={editingExpense}
              setEditingExpense={setEditingExpense}
            />

            <ExpenseList
  refresh={refresh}
  refreshExpenses={refreshExpenses}
  setEditingExpense={setEditingExpense}
/>
          </>
        )}

        {/* ANALYTICS */}

{activePage === "analytics" && (
  <>
    <div className="analytics-hero">

      <div className="analytics-left">

        <h1>📊 Analytics Dashboard</h1>

        <p>
          Discover spending trends, monitor your financial
          health, and make smarter budgeting decisions with
          powerful visual insights.
        </p>

      </div>

      <div className="analytics-right">

        <div className="analytics-date">
          {new Date().toLocaleDateString("en-GB", {
            month: "long",
            year: "numeric",
          })}
        </div>

      </div>

    </div>

    <Summary refresh={refresh} />
    <MonthlyComparison refresh={refresh} />

    <div className="charts-container">

      <ExpenseChart refresh={refresh} />

      <ExpenseBarChart refresh={refresh} />

    </div>

    
    <div className="analytics-bottom">

    <ExpenseTrendChart refresh={refresh} />

    <InsightsCard refresh={refresh} />

</div>

  </>
)}

    

{/* SETTINGS */}

{activePage === "settings" && (
  <div className="settings-page">

    <div className="settings-header">
      <h1>Settings</h1>
      <p>
        Manage your account preferences and security
      </p>
      <div className="settings-line"></div>
    </div>

    <div className="settings-grid">

      {/* Profile Card */}

      <div className="settings-card profile-card">

        <div className="profile-avatar-large">
          {userName?.charAt(0).toUpperCase()}
        </div>

        <h2>{userName}</h2>

        <p>{userEmail}</p>

        <span className="role-badge">
          Expense Dashboard User
        </span>

      </div>

      {/* Username */}

      <div className="settings-card">

        <div className="card-title">
          👤 Change Username
        </div>

        <p className="card-desc">
          Update your public name
        </p>

        <input
          className="settings-input"
          type="text"
          value={newName}
          onChange={(e) =>
            setNewName(e.target.value)
          }
        />

        <button
          className="settings-btn"
          onClick={handleUpdateName}
        >
          {loadingName
            ? "Updating..."
            : "Update Username"}
        </button>

      </div>

      {/* Password */}

      <div className="settings-card">

        <div className="card-title">
          🔒 Security
        </div>

        <p className="card-desc">
          Keep your account safe and secure
        </p>

        <div className="security-box">

          <h3>Change your password</h3>

          <p>
            Use a strong password to protect
            your account.
          </p>

          <button
  className="password-btn"
  onClick={() =>
    setShowPasswordModal(true)
  }
>
  Change Password
</button>

        </div>

      </div>

      {/* About */}

      <div className="settings-card">

        <div className="card-title">
          ℹ️ About
        </div>

        <div className="about-item">

          <h3>Expense Tracker v1.0</h3>

          <p>
            Personal Finance Management
          </p>

        </div>

        <div className="about-item">

          <h3>Built with</h3>

          <p>
            React • Node • Express • MongoDB
          </p>

        </div>

        <div className="about-item">

          <h3>Designed For</h3>

          <p>
            For a better financial future.
          </p>

        </div>

      </div>

    </div>

  </div>
)}

      </div>
      
      <ChangePasswordModal
  open={showPasswordModal}
  onClose={() =>
    setShowPasswordModal(false)
  }
/>
    </div>
  );
}

export default Dashboard;