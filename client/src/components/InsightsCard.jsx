import { useEffect, useState } from "react";
import API from "../services/expenseApi";
import "../styles/InsightsCard.css";

function InsightsCard({ refresh }) {
  const [insights, setInsights] = useState({
    highestCategory: "-",
    highestAmount: 0,
    average: 0,
    categories: 0,
    highestExpense: 0,
    totalExpenses: 0,
    transactions: 0,
  });

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await API.get("/");

        const expenses = res.data;

        if (expenses.length === 0) return;

        const categoryTotals = {};
        let total = 0;
        let highestExpense = 0;

        expenses.forEach((expense) => {
          total += expense.amount;

          if (expense.amount > highestExpense) {
            highestExpense = expense.amount;
          }

          if (categoryTotals[expense.category]) {
            categoryTotals[expense.category] += expense.amount;
          } else {
            categoryTotals[expense.category] = expense.amount;
          }
        });

        const highestCategory = Object.keys(categoryTotals).reduce((a, b) =>
          categoryTotals[a] > categoryTotals[b] ? a : b
        );

        setInsights({
          highestCategory,
          highestAmount: categoryTotals[highestCategory],
          average: Math.round(total / expenses.length),
          categories: Object.keys(categoryTotals).length,
          highestExpense,
          totalExpenses: total,
          transactions: expenses.length,
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchExpenses();
  }, [refresh]);

  return (
    <div className="insights-card">
      <h2>💡 Smart Insights</h2>

      <div className="insight-grid">

        <div className="insight-box">
          <h3>🔥 Highest Category</h3>
          <p>{insights.highestCategory}</p>
          <span>₹{insights.highestAmount}</span>
        </div>

        <div className="insight-box">
          <h3>💸 Average Expense</h3>
          <p>₹{insights.average}</p>
        </div>

        <div className="insight-box">
          <h3>📂 Categories</h3>
          <p>{insights.categories}</p>
        </div>

        <div className="insight-box">
          <h3>🏆 Biggest Expense</h3>
          <p>₹{insights.highestExpense}</p>
        </div>

        <div className="insight-box">
          <h3>💰 Total Expenses</h3>
          <p>₹{insights.totalExpenses}</p>
        </div>

        <div className="insight-box">
          <h3>📝 Transactions</h3>
          <p>{insights.transactions}</p>
        </div>

      </div>
    </div>
  );
}

export default InsightsCard;