import { useEffect, useState } from "react";
import API from "../services/expenseApi";
import "../styles/RecentTransactions.css";

function getCategoryData(category) {
  const cat = category.toLowerCase();

  if (cat.includes("food"))
    return {
      icon: "🍕",
      color: "linear-gradient(135deg,#f97316,#fb923c)",
    };

  if (cat.includes("drink"))
    return {
      icon: "🥤",
      color: "linear-gradient(135deg,#06b6d4,#3b82f6)",
    };

  if (cat.includes("travel"))
    return {
      icon: "🚌",
      color: "linear-gradient(135deg,#2563eb,#60a5fa)",
    };

  if (cat.includes("bill"))
    return {
      icon: "📱",
      color: "linear-gradient(135deg,#8b5cf6,#a855f7)",
    };

  if (cat.includes("snack"))
    return {
      icon: "🍟",
      color: "linear-gradient(135deg,#f59e0b,#fbbf24)",
    };

  return {
    icon: "💰",
    color: "linear-gradient(135deg,#22c55e,#4ade80)",
  };
}

function RecentTransactions({ refresh }) {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await API.get("/");

        const sortedExpenses = response.data.sort(
          (a, b) =>
            new Date(b.date) - new Date(a.date)
        );

        setExpenses(sortedExpenses.slice(0, 4));
      } catch (error) {
        console.error(error);
      }
    };

    fetchExpenses();
  }, [refresh]);

  return (
  <div className="recent-card">

    <div className="recent-header">

      <div>
        <h2>💳 Recent Transactions</h2>
        <p>Your latest expenses</p>
      </div>

      <div className="transaction-count">
        <span>{expenses.length}</span>
        <small>Transactions</small>
      </div>

    </div>

    <div className="transaction-list">

      {expenses.map((expense) => (

        <div
          key={expense._id}
          className="transaction-item"
        >

          <div className="transaction-left">

            <div
              className="transaction-icon"
              style={{
                background:
                  getCategoryData(expense.category).color,
              }}
            >
              {getCategoryData(expense.category).icon}
            </div>

            <div className="transaction-info">

              <h3>{expense.title}</h3>

              <div className="transaction-meta">

                <span className="category-badge">
                  {expense.category}
                </span>

                <span className="transaction-date">
                  Today
                </span>

              </div>

            </div>

          </div>

          <div className="transaction-right">

            <div className="transaction-amount">
              ₹{expense.amount}
            </div>

            <div className="transaction-arrow">
              ›
            </div>

          </div>

        </div>

      ))}

    </div>

    <button className="view-all-btn">
      📋 View All Transactions
    </button>

  </div>
);
}

export default RecentTransactions;