import { useEffect, useState } from "react";
import API from "../services/expenseApi";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Doughnut } from "react-chartjs-2";
import { categoryColors } from "../utils/categoryColors";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function ExpenseChart({ refresh }) {
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
    const category = expense.category.trim();

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
  (category) => categoryColors[category.trim()] || "#94A3B8"
),
hoverOffset:30,
borderRadius:8,
borderWidth:3,
borderColor:"#1f2937",

        
      },
    ],
  };
  const textColor = getComputedStyle(document.body)
  .getPropertyValue("--text-primary")
  .trim();

const options = {

responsive:true,

maintainAspectRatio:false,

cutout:"68%",

plugins:{

legend:{

position:"bottom",

labels:{

color:textColor,

padding:18,

usePointStyle:true,

pointStyle:"circle",

font:{

size:14,

weight:"600",

},

},

},

tooltip: {
  backgroundColor: "#111827",
  titleColor: "#fff",
  bodyColor: "#fff",
  cornerRadius: 12,
  padding: 15,
  displayColors: true,

  callbacks: {
    label: function(context) {
      return ` ₹${context.parsed.toLocaleString()}`;
    }
  }
},

},

animation:{

animateRotate:true,

animateScale:true,

duration:1800,
easing:"easeOutCubic",

},

};

  return (
    <div className="chart-card pie-chart-card">
      <h2
style={{
textAlign:"center",
marginBottom:"20px",
color:"var(--text-primary)",
}}
>
        Expense By Category
      </h2>

      <div className="pie-wrapper">
        <Doughnut
        data={data}
        options={options}
        />
      </div>
    </div>
  );
}

export default ExpenseChart;