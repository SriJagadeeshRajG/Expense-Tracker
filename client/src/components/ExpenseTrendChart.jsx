import { useEffect, useState } from "react";
import API from "../services/expenseApi";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

function ExpenseTrendChart({
  refresh,
}) {
  const [expenses, setExpenses] =
    useState([]);

  useEffect(() => {
    const fetchExpenses =
      async () => {
        try {
          const response =
            await API.get("/");

          setExpenses(
            response.data
          );
        } catch (error) {
          console.error(error);
        }
      };

    fetchExpenses();
  }, [refresh]);

  const monthlyTotals = {};

expenses.forEach((expense) => {
  const date = new Date(expense.date);

  const key = `${date.getFullYear()}-${date.getMonth()}`;

  if (!monthlyTotals[key]) {
    monthlyTotals[key] = {
      total: 0,
      label: date.toLocaleString("default", {
        month: "short",
        year: "2-digit",
      }),
    };
  }

  monthlyTotals[key].total += expense.amount;
});

const sortedMonths = Object.keys(monthlyTotals).sort();

const labels = sortedMonths.map(
  (month) => monthlyTotals[month].label
);

const totals = sortedMonths.map(
  (month) => monthlyTotals[month].total
);

  const data = {
  labels,

  datasets: [
    {
      label: "Monthly Spending",

      data: totals,

      borderColor: "#38bdf8",

      backgroundColor: "rgba(56,189,248,0.18)",

      fill: true,

      tension: 0.45,

      borderWidth: 4,

      pointRadius: 6,

      pointHoverRadius: 10,

      pointBackgroundColor: "#38bdf8",

      pointBorderColor: "#ffffff",

      pointBorderWidth: 3,

      pointHoverBackgroundColor: "#ffffff",

      pointHoverBorderColor: "#38bdf8",

      pointHoverBorderWidth: 3,
    },
  ],
};

  const textColor = getComputedStyle(document.body)
  .getPropertyValue("--text-primary")
  .trim();

const isLight =
  document.body.classList.contains("light-theme");

const gridColor = isLight
  ? "#d1d5db"
  : "#374151";

const options = {

  responsive: true,

  maintainAspectRatio: false,

  animation: {
    duration: 1800,
    easing: "easeOutQuart",
  },

  plugins: {

    legend: {
      labels: {
        color: textColor,
        font: {
          size: 15,
          weight: "600",
        },
      },
    },

    tooltip: {

      backgroundColor: "#111827",

      titleColor: "#fff",

      bodyColor: "#fff",

      cornerRadius: 12,

      padding: 14,

      callbacks: {
        label: (context) =>
          ` ₹${context.parsed.y.toLocaleString()}`,
      },

    },

  },

  scales: {

    x: {

      ticks: {
        color: textColor,
      },

      grid: {
        display: false,
      },

    },

    y: {

      beginAtZero: false,

      ticks: {
        color: textColor,
      },

      grid: {
        color: gridColor,
      },

    },

  },

};

  return (
    <div className="chart-card trend-chart-card">
      <h2
style={{
textAlign:"center",
marginBottom:"20px",
fontSize:"34px",
fontWeight:"700",
color:"var(--text-primary)",
}}
>
📈 Monthly Expense Trend
</h2>

      <div className="line-chart-wrapper">
  <Line
    data={data}
    options={options}
  />
</div>
    </div>
  );
}

export default ExpenseTrendChart;