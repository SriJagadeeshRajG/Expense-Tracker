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
      <h2>🕒 Recent Transactions</h2>
      <span>{expenses.length} Recent</span>
    </div>

    {expenses.map((expense) => (
      <div
        key={expense._id}
        className="transaction-item"
      >
        <div className="transaction-left">

          <div className="transaction-icon">
            {getCategoryData(expense.category).icon}
          </div>

          <div>

            <h3>{expense.title}</h3>

            <p>

              <span className="category-badge">
                {expense.category}

              </span>

              {" • "}

              {new Date(
                expense.date
              ).toLocaleDateString(
                "en-GB",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }
              )}

            </p>

          </div>

        </div>

        <div className="transaction-amount">

          ₹{expense.amount}

        </div>

      </div>
    ))}

  </div>
);
}

export default RecentTransactions;