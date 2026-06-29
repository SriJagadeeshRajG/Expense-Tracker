import { useEffect, useState } from "react";
import API from "../services/expenseApi";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";
import { categoryColors } from "../utils/categoryColors";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

function ExpenseBarChart({ refresh }) {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await API.get("/");
        setExpenses(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchExpenses();
  }, [refresh]);

  const categoryTotals = {};

  expenses.forEach((expense) => {
    const category = expense.category;

    if (categoryTotals[category]) {
      categoryTotals[category] += expense.amount;
    } else {
      categoryTotals[category] = expense.amount;
    }
  });

  const data = {
  labels: Object.keys(categoryTotals),

  datasets: [
    {
      label: "Expenses",
      data: Object.values(categoryTotals),

      backgroundColor: Object.keys(categoryTotals).map(
  category =>
    categoryColors[category.trim()] || "#38bdf8"
),

      borderRadius: 12,
      borderSkipped: false,
      borderWidth: 0,
      hoverBorderWidth: 2,
      hoverBorderColor: "#ffffff",
      hoverBackgroundColor: [
        "#60A5FA",
        "#34D399",
        "#FBBF24",
        "#F87171",
        "#A78BFA",
        "#F472B6",
        "#22D3EE",
        "#FB923C",
        "#A3E635",
        "#818CF8",
      ],
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

  layout: {
    padding: {
      bottom: 35,
      left: 10,
      right: 10,
      top: 10,
    },
  },

  plugins: {
    legend: {
      labels: {
        color: textColor,
      },
    },
  },

  scales: {
    x: {
      offset: true,

      ticks: {
        color: textColor,
        autoSkip: false,
        maxRotation: 45,
        minRotation: 45,
        font: {
          size: 14,
          weight: "600",
        },
      },

      grid: {
        display: false,
      },
    },

    y: {
      beginAtZero: true,

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
    <div className="chart-card">
      <h2
style={{
textAlign:"center",
marginBottom:"25px",
fontSize:"34px",
fontWeight:"700",
color:"var(--text-primary)"
}}
>
📊 Expense Comparison
</h2>

      <div
  style={{
    height: "460px",
    width: "100%",
  }}
>
  <Bar
    data={data}
    options={options}
  />
</div>
    </div>
  );
}

export default ExpenseBarChart;