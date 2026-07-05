import { useEffect, useState } from "react";
import API from "../services/expenseApi";
import "../styles/Summary.css";
import AnimatedNumber from "./AnimatedNumber";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function Summary({ refresh }) {
  const [total, setTotal] = useState(0);
  const [count, setCount] = useState(0);
  const [highest, setHighest] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchSummary = async () => {
    try {
      const totalRes = await API.get("/summary/total");
      const countRes = await API.get("/summary/count");
      const highestRes = await API.get("/summary/highest");

      console.log("Total:", totalRes.data);
      console.log("Count:", countRes.data);
      console.log("Highest:", highestRes.data);

      setTotal(Number(totalRes.data.total));
      setCount(Number(countRes.data.count));
      setHighest(Number(highestRes.data.highest));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  fetchSummary();
}, [refresh]);

  return (
    <div className="summary-section">

      <div className="summary-header">

  <span className="summary-label">
    📊 Dashboard Overview
  </span>

  <h2 className="summary-title">
    Financial Summary
  </h2>

  <p>
    Keep track of your expenses, spending habits, and financial progress in one place.
  </p>

</div>

      <div className="summary-container">

        {/* TOTAL */}

        <motion.div
          className="summary-card total-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >

          <div className="summary-top">
            <div className="summary-icon">💰</div>

            <span className="summary-badge">
              Total
            </span>
          </div>

          <h3>Total Expenses</h3>

          <h1>
            {loading ? (
              <Skeleton
                width={150}
                height={48}
                baseColor="#374151"
                highlightColor="#4b5563"
              />
            ) : (
              <>
                ₹ <AnimatedNumber value={total} />
              </>
            )}
          </h1>

          <div className="summary-footer">

    <span className="trend up">
        ▲ Active
    </span>

    <small>
        Updated Today
    </small>

</div>

        </motion.div>

        {/* RECORDS */}

        <motion.div
          className="summary-card records-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          viewport={{ once: true }}
        >

          <div className="summary-top">
            <div className="summary-icon">📝</div>

            <span className="summary-badge">
              Records
            </span>
          </div>

          <h3>Total Records</h3>

          <h1>
            {loading ? (
              <Skeleton
                width={120}
                height={48}
                baseColor="#374151"
                highlightColor="#4b5563"
              />
            ) : (
              <AnimatedNumber value={count} />
            )}
          </h1>

          <div className="summary-footer">

    <span className="trend neutral">
        📝 Transactions
    </span>

    <small>
        This Month
    </small>

</div>

        </motion.div>

        {/* HIGHEST */}

        <motion.div
          className="summary-card highest-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >

          <div className="summary-top">
            <div className="summary-icon">🏆</div>

            <span className="summary-badge">
              Highest
            </span>
          </div>

          <h3>Highest Expense</h3>

          <h1>
            {loading ? (
              <Skeleton
                width={150}
                height={48}
                baseColor="#374151"
                highlightColor="#4b5563"
              />
            ) : (
              <>
                ₹ <AnimatedNumber value={highest} />
              </>
            )}
          </h1>

          <div className="summary-footer">

    <span className="trend danger">
        🔥 Highest
    </span>

    <small>
        Biggest Purchase
    </small>

</div>

        </motion.div>

      </div>

    </div>
  );
}

export default Summary;