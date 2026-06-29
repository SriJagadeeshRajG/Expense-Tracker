import { useEffect, useState } from "react";
import API from "../services/expenseApi";
import "../styles/QuickStats.css";

function QuickStats({ refresh }) {

  const [today, setToday] = useState(0);
  const [week, setWeek] = useState(0);
  const [month, setMonth] = useState(0);
  const [average, setAverage] = useState(0);

  useEffect(() => {

    const fetchData = async () => {

      const res = await API.get("/");

      const expenses = res.data;

      const now = new Date();

      let todayTotal = 0;
      let weekTotal = 0;
      let monthTotal = 0;

      expenses.forEach((expense) => {

        const d = new Date(expense.date);

        if (d.toDateString() === now.toDateString()) {
          todayTotal += expense.amount;
        }

        const diff =
          (now - d) / (1000 * 60 * 60 * 24);

        if (diff <= 7) {
          weekTotal += expense.amount;
        }

        if (
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        ) {
          monthTotal += expense.amount;
        }

      });

      setToday(todayTotal);
      setWeek(weekTotal);
      setMonth(monthTotal);

      setAverage(
        expenses.length
          ? Math.round(monthTotal / expenses.length)
          : 0
      );

    };

    fetchData();

  }, [refresh]);

  const cards = [
    {
      icon: "💳",
      title: "Today",
      value: today
    },
    {
      icon: "📅",
      title: "This Week",
      value: week
    },
    {
      icon: "🗓",
      title: "This Month",
      value: month
    },
    {
      icon: "📈",
      title: "Average",
      value: average
    }
  ];

  return (

    <div className="quick-stats">

      {cards.map((card) => (

        <div
          key={card.title}
          className="quick-card"
        >

          <h3>{card.icon}</h3>

          <small>{card.title}</small>

          <h2>₹{card.value}</h2>

        </div>

      ))}

    </div>

  );

}

export default QuickStats;