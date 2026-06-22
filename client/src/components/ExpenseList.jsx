import { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/ExpenseList.css";

function ExpenseList({
  refresh,
  refreshExpenses,
  setEditingExpense
}) {
  const [expenses, setExpenses] = useState([]);

  const deleteExpense = async (id) => {
    try {
      await API.delete(`/${id}`);

      refreshExpenses();

      alert("Expense Deleted");

      const response = await API.get("/");
      setExpenses(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const editExpense = (expense) => {
    setEditingExpense(expense);
  };

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

  return (
    <div className="expense-list">
      <h2>All Expenses</h2>

      {expenses.map((expense) => (
        <div
          key={expense._id}
          className="expense-card"
        >
          <p>Title: {expense.title}</p>
          <p>Amount: ₹{expense.amount}</p>
          <p>Category: {expense.category}</p>

          <button
            className="delete-btn"
            onClick={() =>
              deleteExpense(expense._id)
            }
          >
            Delete
          </button>

          <button
            className="edit-btn"
            onClick={() =>
              editExpense(expense)
            }
          >
            Edit
          </button>
        </div>
      ))}
    </div>
  );
}

export default ExpenseList;