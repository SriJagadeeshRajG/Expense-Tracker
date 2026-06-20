import { useEffect, useState } from "react";
import API from "../services/api";

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

      <h3>Total Expenses: ₹{total}</h3>

      <h3>Total Records: {count}</h3>

      <h3>Highest Expense: ₹{highest}</h3>
    </div>
  );
}

export default Summary;