import { useEffect, useState } from "react";
import expenseAPI from "../services/expenseApi";
import budgetAPI from "../services/budgetApi";
import "../styles/BudgetCard.css";
import { FaWallet } from "react-icons/fa";
import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";

function BudgetCard({ refresh }) {
  const [total, setTotal] = useState(0);
  const [budget, setBudget] = useState(5000);

  const [editing, setEditing] = useState(false);
  const [newBudget, setNewBudget] = useState("");

   const fetchData = async () => {
    try {
      const totalRes = await expenseAPI.get("/summary/total");
      setTotal(totalRes.data.total);

      const budgetRes = await budgetAPI.get("/");
      setBudget(budgetRes.data.amount);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refresh]);

 

  const saveBudget = async () => {
    try {
      await budgetAPI.put(
  "/",
  {
    amount: Number(newBudget),
  },
  {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  }
);  

      setBudget(Number(newBudget));
      setEditing(false);
      setNewBudget("");
    } catch (err) {
      console.error(err);
    }
  };

  const remaining = budget - total;
  const percentage = (total / budget) * 100;

  return (
    <div className="budget-card">
      <div className="budget-header">

  <div>

    <h2>💰 Monthly Budget</h2>

    <p>Track your monthly spending</p>

  </div>

  <div
  style={{
    width: "90px",
    height: "90px",
  }}
>
  <CircularProgressbar
    value={Math.min(percentage, 100)}
    text={`${Math.round(percentage)}%`}
    styles={buildStyles({
      textColor: "#fff",
      textSize: "18px",
      pathColor:
        percentage < 60
          ? "#22c55e"
          : percentage < 90
          ? "#facc15"
          : "#ef4444",
      trailColor: "rgba(255,255,255,.08)",
    })}
  />
</div>

</div>

      {!editing ? (
        <>
          <div className="budget-amount">

  <span className="budget-label">
    Available Budget
  </span>

  <h1>
    ₹{budget.toLocaleString()}
  </h1>

  <small>
    Monthly Spending Limit
  </small>

</div>

          
        </>
      ) : (
        <div className="budget-edit">
          <input
            type="number"
            placeholder="Enter Budget"
            value={newBudget}
            onChange={(e) => setNewBudget(e.target.value)}
          />

          <div className="budget-actions">
            <button
              className="save-btn"
              onClick={saveBudget}
            >
              Save
            </button>

            <button
              className="cancel-btn"
              onClick={() => {
                setEditing(false);
                setNewBudget("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="budget-details">

  <div>

  <span>💸 Spent</span>

  <h3>
    ₹{total.toLocaleString()}
  </h3>

</div>

<div>

  <span>💎 Remaining</span>

  <h3>
    ₹{remaining.toLocaleString()}
  </h3>

</div>

</div>

      <div className="budget-progress">

  <div
    className="budget-fill"
    style={{
      width: `${Math.min(percentage,100)}%`,
    }}
  />

</div>

<div className="budget-alert">

  {percentage < 60 && (
    <>
      <h4>✅ Excellent Budget Control</h4>
      <p>
        You still have ₹{remaining} remaining this month.
      </p>
    </>
  )}

  {percentage >= 60 && percentage < 90 && (
    <>
      <h4>⚠ Budget Near Limit</h4>
      <p>
        You've used {Math.round(percentage)}% of your budget.
      </p>
    </>
  )}

  {percentage >= 90 && (
    <>
      <h4>🚨 Budget Limit Reached</h4>
      <p>
        You're close to or over your monthly budget.
      </p>
    </>
  )}

</div>
<button
  className="budget-btn"
  onClick={() => {
    setEditing(true);
    setNewBudget(budget);
  }}
>
  <FaWallet />
  <span>Update Monthly Budget</span>
</button>
    </div>
  );
}

export default BudgetCard;