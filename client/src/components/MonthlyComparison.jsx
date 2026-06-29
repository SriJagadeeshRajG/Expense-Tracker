import { useEffect, useState } from "react";
import API from "../services/expenseApi";
import "../styles/MonthlyComparison.css";

function MonthlyComparison({ refresh }) {
  const [thisMonthTotal, setThisMonthTotal] = useState(0);
  const [lastMonthTotal, setLastMonthTotal] = useState(0);
  const fetchComparison = async () => {
    try {
      const response = await API.get("/");
      const expenses = response.data;

      const now = new Date();

      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const previousMonth =
        currentMonth === 0 ? 11 : currentMonth - 1;

      const previousYear =
        currentMonth === 0
          ? currentYear - 1
          : currentYear;

      let currentTotal = 0;
      let previousTotal = 0;

      expenses.forEach((expense) => {
        const date = new Date(expense.date);

        if (
          date.getMonth() === currentMonth &&
          date.getFullYear() === currentYear
        ) {
          currentTotal += expense.amount;
        }

        if (
          date.getMonth() === previousMonth &&
          date.getFullYear() === previousYear
        ) {
          previousTotal += expense.amount;
        }
      });

      setThisMonthTotal(currentTotal);
      setLastMonthTotal(previousTotal);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchComparison();
  }, [refresh]);

  

  const difference = thisMonthTotal - lastMonthTotal;

  const percentage =
    lastMonthTotal === 0
      ? 100
      : ((difference / lastMonthTotal) * 100).toFixed(1);

  return (
    <div className="comparison-card">

      <h2>📅 Monthly Comparison</h2>

      <div className="comparison-grid">

        <div className="compare-box">
          <h3>This Month</h3>
          <p>₹{thisMonthTotal}</p>
        </div>

        <div className="compare-box">
          <h3>Last Month</h3>
          <p>₹{lastMonthTotal}</p>
        </div>

        <div className="compare-box">
          <h3>Difference</h3>

          <p
            style={{
              color:
                difference >= 0
                  ? "#ef4444"
                  : "#22c55e",
            }}
          >
            {difference >= 0 ? "▲" : "▼"} ₹
            {Math.abs(difference)}
          </p>

          <span>
            {Math.abs(percentage)}%
          </span>

        </div>

      </div>

    </div>
  );
}

export default MonthlyComparison;