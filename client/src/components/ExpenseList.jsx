import { useEffect, useState } from "react";
import API from "../services/expenseApi";
import "../styles/ExpenseList.css";

import toast from "react-hot-toast";
import DeleteModal from "./DeleteModal";
import { exportExpensesToExcel } from "../utils/exportToExcel";
import Select from "react-select";
import ExportPDFButton from "./ExportPDFButton";

import {
  FaEdit,
  FaTrashAlt,
} from "react-icons/fa";

function ExpenseList({
  refresh,
  refreshExpenses,
  setEditingExpense,
}) {
  const [expenses, setExpenses] = useState([]);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [selectedExpense, setSelectedExpense] =
    useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const expensesPerPage = 10;

  const [searchTerm, setSearchTerm] =
    useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [sortOption, setSortOption] =
    useState("newest");

  const [dateFilter, setDateFilter] =
    useState("all");
  const fetchExpenses = async () => {
    try {
      const response = await API.get("/");
      setExpenses(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [refresh]);
  useEffect(() => {
  setCurrentPage(1);
}, [
  searchTerm,
  selectedCategory,
  dateFilter,
  sortOption,
]);

  

  const deleteExpense = async () => {
  try {
    await API.delete(`/${selectedExpense._id}`);

    setShowDeleteModal(false);
    setSelectedExpense(null);

    refreshExpenses();
    fetchExpenses();

    setTimeout(() => {
      toast.success("Expense Deleted Successfully 🗑️");
    }, 200);

  } catch (error) {
    console.error(error);

    toast.error("Delete Failed ❌");
  }
};

  const openDeleteModal = (expense) => {
    setSelectedExpense(expense);
    setShowDeleteModal(true);
  };

  const editExpense = (expense) => {
    setEditingExpense(expense);
  };

  const categories = [
    "All",
    ...new Set(expenses.map(e => e.category)),
  ].sort();

  const categoryOptions = categories.map(category => ({
    value: category,
    label: category,
  }));

  const dateOptions = [
    { value: "all", label: "📅 All Time" },
    { value: "today", label: "📆 Today" },
    { value: "week", label: "🗓 This Week" },
    { value: "month", label: "📅 This Month" },
    { value: "lastMonth", label: "⏮ Last Month" },
  ];

  const sortOptions = [
    { value: "newest", label: "🆕 Newest First" },
    { value: "oldest", label: "📜 Oldest First" },
    { value: "highest", label: "💰 Highest Amount" },
    { value: "lowest", label: "💸 Lowest Amount" },
    { value: "az", label: "🔤 A → Z" },
    { value: "za", label: "🔠 Z → A" },
  ];

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#273244",
      border: "1px solid #334155",
      borderRadius: "14px",
      minHeight: "52px",
      boxShadow: "none",
      cursor: "pointer",
    }),

    menu: (provided) => ({
  ...provided,
  backgroundColor: "#273244",
  borderRadius: "14px",
  minWidth: "220px",
  width: "max-content",
  zIndex: 999999,
}),
     menuPortal: (base) => ({
  ...base,
  zIndex: 999999,
}),

container: (base) => ({
  ...base,
  minWidth: "220px",
  width: "220px",
}),

    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? "#2563eb"
        : "#273244",
      color: "#fff",
      cursor: "pointer",
    }),

    singleValue: (provided) => ({
      ...provided,
      color: "#fff",
    }),

    placeholder: (provided) => ({
      ...provided,
      color: "#94a3b8",
    }),

    dropdownIndicator: (provided) => ({
      ...provided,
      color: "#94a3b8",
    }),

    indicatorSeparator: () => ({
      display: "none",
    }),
  };
    const filteredExpenses = expenses
    .filter((expense) => {

      const search = searchTerm.toLowerCase();

      const matchesSearch =
        expense.title.toLowerCase().includes(search) ||
        expense.category.toLowerCase().includes(search) ||
        expense.amount.toString().includes(search);

      const matchesCategory =
        selectedCategory === "All" ||
        expense.category === selectedCategory;

      const expenseDate = new Date(expense.date);
      const today = new Date();

      let matchesDate = true;

      switch (dateFilter) {

        case "today":
          matchesDate =
            expenseDate.toDateString() ===
            today.toDateString();
          break;

        case "week": {
          const weekAgo = new Date();
          weekAgo.setDate(today.getDate() - 7);

          matchesDate =
            expenseDate >= weekAgo;
          break;
        }

        case "month":
          matchesDate =
            expenseDate.getMonth() ===
              today.getMonth() &&
            expenseDate.getFullYear() ===
              today.getFullYear();
          break;

        case "lastMonth": {
          const lastMonth = new Date();

          lastMonth.setMonth(
            today.getMonth() - 1
          );

          matchesDate =
            expenseDate.getMonth() ===
              lastMonth.getMonth() &&
            expenseDate.getFullYear() ===
              lastMonth.getFullYear();

          break;
        }

        default:
          matchesDate = true;
      }

      return (
        matchesSearch &&
        matchesCategory &&
        matchesDate
      );
    })
    .sort((a, b) => {

      switch (sortOption) {

        case "highest":
          return b.amount - a.amount;

        case "lowest":
          return a.amount - b.amount;

        case "oldest":
          return new Date(a.date) - new Date(b.date);

        case "az":
          return a.title.localeCompare(b.title);

        case "za":
          return b.title.localeCompare(a.title);

        default:
          return new Date(b.date) - new Date(a.date);

      }

    });
  const indexOfLastExpense =
  currentPage * expensesPerPage;

const indexOfFirstExpense =
  indexOfLastExpense - expensesPerPage;

const currentExpenses =
  filteredExpenses.slice(
    indexOfFirstExpense,
    indexOfLastExpense
  );

const totalPages = Math.ceil(
  filteredExpenses.length / expensesPerPage
);

  const getExpenseStyle = (category) => {

    const cat = category.toLowerCase();

    if (cat.includes("travel"))
      return {
        icon: "🚌",
        gradient:
          "linear-gradient(135deg,#3b82f6,#2563eb)",
      };

    if (cat.includes("food"))
      return {
        icon: "🍕",
        gradient:
          "linear-gradient(135deg,#f97316,#ef4444)",
      };

    if (cat.includes("drink"))
      return {
        icon: "🥤",
        gradient:
          "linear-gradient(135deg,#06b6d4,#3b82f6)",
      };

    if (cat.includes("bill"))
      return {
        icon: "📱",
        gradient:
          "linear-gradient(135deg,#ec4899,#8b5cf6)",
      };

    if (cat.includes("snack"))
      return {
        icon: "🍟",
        gradient:
          "linear-gradient(135deg,#8b5cf6,#6366f1)",
      };

    return {
      icon: "💰",
      gradient:
        "linear-gradient(135deg,#7c3aed,#2563eb)",
    };

  };

  return (

    <div className="expense-list">

      <div className="filters-container">

        <input
          className="search-input"
          type="text"
          placeholder="🔍 Search expenses..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
        />

        <div className="filters-row">

  <Select
    options={categoryOptions}
    value={categoryOptions.find(
      (o) => o.value === selectedCategory
    )}
    onChange={(selected) =>
      setSelectedCategory(selected.value)
    }
    styles={customSelectStyles}
    isSearchable={false}
    menuPortalTarget={document.body}
    menuPosition="absolute"
  />

  <Select
    options={dateOptions}
    value={dateOptions.find(
      (o) => o.value === dateFilter
    )}
    onChange={(selected) =>
      setDateFilter(selected.value)
    }
    styles={customSelectStyles}
    isSearchable={false}
    menuPortalTarget={document.body}
    menuPosition="absolute"
  />

  <Select
    options={sortOptions}
    value={sortOptions.find(
      (o) => o.value === sortOption
    )}
    onChange={(selected) =>
      setSortOption(selected.value)
    }
    styles={customSelectStyles}
    isSearchable={false}
    menuPortalTarget={document.body}
    menuPosition="absolute"
  />

</div>

<div className="export-buttons">

  <button
    className="export-btn"
    onClick={() =>
      exportExpensesToExcel(filteredExpenses)
    }
  >
    📊 Export Excel
  </button>

  <ExportPDFButton />

</div>
        

      </div>

      
            {filteredExpenses.length === 0 ? (

        <div className="no-expenses">

    <div className="empty-icon">
        📂
    </div>

    <h2>No Expenses Found</h2>

    <p>
        We couldn't find any matching expenses.
    </p>

    <small>
        Try changing your filters or add a new expense.
    </small>

</div>

      ) : (

        currentExpenses.map((expense) => {

          const style = getExpenseStyle(expense.category);

          return (

            <div
              key={expense._id}
              className="expense-card"
            >

              <div className="expense-left">

                <div
                  className="expense-icon"
                  style={{
                    background: style.gradient,
                  }}
                >
                  {style.icon}
                </div>

                <div>

                  <h3>{expense.title}</h3>

                  <span className="expense-category">
                    {expense.category}
                  </span>

                </div>

              </div>

              <div className="expense-middle">

                <h2>
                  ₹
                  {new Intl.NumberFormat("en-IN").format(
                    expense.amount
                  )}
                </h2>

                <p>
                  📅{" "}
                  {new Date(expense.date).toLocaleDateString(
                    "en-GB",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </p>

              </div>

              <div className="expense-actions">

                <button
                  className="edit-btn"
                  onClick={() =>
                    editExpense(expense)
                  }
                >
                  <FaEdit />
                  <span>Edit</span>
                </button>

                <button
                  className="delete-btn"
                  onClick={() =>
                    openDeleteModal(expense)
                  }
                >
                  <FaTrashAlt />
                  <span>Delete</span>
                </button>

              </div>

            </div>

          );

        })

      )}

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedExpense(null);
        }}
        onDelete={deleteExpense}
        expenseTitle={selectedExpense?.title || ""}
      />
      {totalPages > 1 && (
  <div className="pagination">

    <button
      onClick={() =>
        setCurrentPage((prev) => prev - 1)
      }
      disabled={currentPage === 1}
      className="page-btn"
    >
      ← Previous
    </button>

    {Array.from(
      { length: totalPages },
      (_, index) => (
        <button
          key={index}
          onClick={() =>
            setCurrentPage(index + 1)
          }
          className={
            currentPage === index + 1
              ? "page-number active-page"
              : "page-number"
          }
        >
          {index + 1}
        </button>
      )
    )}

    <button
      onClick={() =>
        setCurrentPage((prev) => prev + 1)
      }
      disabled={currentPage === totalPages}
      className="page-btn"
    >
      Next →
    </button>

  </div>
)}

    </div>
  );
}

export default ExpenseList;