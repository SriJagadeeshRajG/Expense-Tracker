import { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/Summary.css";

function Summary({ refresh }) {
  const [total, setTotal] = useState(0);
  const [count, setCount] = useState(0);
  const [highest, setHighest] = useState(0);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const totalRes = await API.get("/summary/total");
        const countRes = await API.get("/summary/count");
        const highestRes = await API.get("/summary/highest");

        setTotal(totalRes.data.total);
        setCount(countRes.data.count);
        setHighest(highestRes.data.highest);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSummary();
  }, [refresh]);

  return (
    <div>
      <h2>Dashboard Summary</h2>

      <div className="summary-container">
        <div className="summary-card">
          <h2>Total Expenses</h2>
          <p>₹{total}</p>
        </div>

        <div className="summary-card">
          <h2>Total Records</h2>
          <p>{count}</p>
        </div>

        <div className="summary-card">
          <h2>Highest Expense</h2>
          <p>₹{highest}</p>
        </div>
      </div>
    </div>
  );
}

export default Summary;