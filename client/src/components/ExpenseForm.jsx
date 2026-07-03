import { useState, useEffect } from "react";
import API from "../services/expenseApi";
import "../styles/ExpenseForm.css";
import toast from "react-hot-toast";
import Select from "react-select";

function ExpenseForm({
  refreshExpenses,
  editingExpense,
  setEditingExpense,
}) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");

  useEffect(() => {
    if (!editingExpense) return;

    setTitle(editingExpense.title);
    setAmount(editingExpense.amount);
    setCategory(editingExpense.category);
  }, [editingExpense]);

  const formatCategory = (text) => {
  const cleaned = text.trim().toLowerCase();

  const categoryMap = {
    food: "Food",
    travel: "Travel",
    "tea / coffee": "Tea / Coffee",
tea: "Tea / Coffee",
coffee: "Tea / Coffee",
drinks: "Tea / Coffee",
    "cool drinks": "Cool Drinks",
    bills: "Bills",
    snacks: "Snacks",
    accessories: "Accessories",
    shopping: "Shopping",
    entertainment: "Entertainment",
    health: "Health",
    education: "Education",
    other: "Other",
  };

  return (
    categoryMap[cleaned] ||
    cleaned
      .split(" ")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() +
          word.slice(1)
      )
      .join(" ")
  );
};

  const categoryOptions = [
    { value: "Food", label: "🍕 Food" },
    { value: "Travel", label: "🚌 Travel" },
    { value: "Tea / Coffee", label: "☕ Tea / Coffee" },
    { value: "Cool Drinks", label: "🥤 Cool Drinks" },
    { value: "Bills", label: "📱 Bills" },
    { value: "Snacks", label: "🍟 Snacks" },
    { value: "Accessories", label: "💰 Accessories" },
    { value: "Shopping", label: "🛒 Shopping" },
    { value: "Entertainment", label: "🎮 Entertainment" },
    { value: "Health", label: "🏥 Health" },
    { value: "Education", label: "📚 Education" },
    { value: "Other", label: "📦 Other" },
  ];

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#2d3748",
      border: "2px solid transparent",
      borderRadius: "14px",
      minHeight: "55px",
      boxShadow: "none",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#2d3748",
      borderRadius: "12px",
      zIndex: 999999,
    }),
    menuPortal: (provided) => ({
  ...provided,
  zIndex: 999999,
}),

menuList: (provided) => ({
  ...provided,
  maxHeight: 240,
}),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#2563eb" : "#2d3748",
      color: "white",
      cursor: "pointer",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "white",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#94a3b8",
    }),
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const finalCategory =
        category === "Other"
          ? formatCategory(customCategory)
          : formatCategory(category);

      if (editingExpense) {
        await API.put(`/${editingExpense._id}`, {
          title,
          amount: Number(amount),
          category: finalCategory,
        });

        toast.success("Expense Updated Successfully");
        setEditingExpense(null);
      } else {
        await API.post("/", {
          title,
          amount: Number(amount),
          category: finalCategory,
        });

        toast.success("Expense Added Successfully");
      }

      refreshExpenses();
      setTitle("");
      setAmount("");
      setCategory("");
      setCustomCategory("");
    } catch (error) {
      console.error(error);
      toast.error("Operation Failed");
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>{editingExpense ? "✏ Edit Expense" : "➕ Add New Expense"}</h2>
        <p>
          {editingExpense
            ? "Update your expense details"
            : "Keep track of your daily spending"}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>📝 Expense Title</label>
          <input
            type="text"
            placeholder="Enter expense title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>💰 Amount</label>
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>🏷 Category</label>

          <Select
  options={categoryOptions}
  placeholder="Select Category"
  value={categoryOptions.find((o) => o.value === category) || null}
  onChange={(selected) => setCategory(selected.value)}
  styles={customSelectStyles}
  isSearchable={false}
  menuPortalTarget={document.body}
  menuPosition="fixed"
  menuPlacement="auto"
/>

          {category === "Other" && (
            <input
              type="text"
              placeholder="Enter your own category"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              style={{ marginTop: "12px" }}
              required
            />
          )}
        </div>

        <button className="submit-btn" type="submit">
          {editingExpense ? "💾 Update Expense" : "➕ Add Expense"}
        </button>
      </form>
    </div>
  );
}

export default ExpenseForm;
