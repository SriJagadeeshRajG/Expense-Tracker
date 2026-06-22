import { useState, useEffect } from "react";
import API from "../services/api";
import "../styles/ExpenseForm.css";

function ExpenseForm({
  refreshExpenses,
  editingExpense,
  setEditingExpense
}) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
  if (!editingExpense) return;

  setTitle(() => editingExpense.title);
  setAmount(() => editingExpense.amount);
  setCategory(() => editingExpense.category);
}, [editingExpense]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingExpense) {
        await API.put(`/${editingExpense._id}`, {
          title,
          amount,
          category
        });

        alert("Expense Updated Successfully");

        setEditingExpense(null);
      } else {
        await API.post("/", {
          title,
          amount,
          category
        });

        alert("Expense Added Successfully");
      }

      refreshExpenses();

      setTitle("");
      setAmount("");
      setCategory("");
    } catch (error) {
      console.error(error);
      alert("Operation Failed");
    }
  };

  return (
    <div className="form-container">
      <h2>
        {editingExpense ? "Edit Expense" : "Add Expense"}
      </h2>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Enter Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <br />

        <div>
          <input
            type="number"
            placeholder="Enter Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <br />

        <div>
          <input
            type="text"
            placeholder="Enter Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>

        <br />

        <button type="submit">
          {editingExpense
            ? "Update Expense"
            : "Add Expense"}
        </button>
      </form>
    </div>
  );
}

export default ExpenseForm;