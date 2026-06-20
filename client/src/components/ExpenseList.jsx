import { useEffect, useState } from "react";
import API from "../services/api";

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
    <div>
      <h2>All Expenses</h2>

      {expenses.map((expense) => (
        <div key={expense._id}>
          <p>Title: {expense.title}</p>
          <p>Amount: ₹{expense.amount}</p>
          <p>Category: {expense.category}</p>

          <button
            onClick={() => deleteExpense(expense._id)}
          >
            Delete
          </button>

          <button
            onClick={() => editExpense(expense)}
          >
            Edit
          </button>

          <hr />
        </div>
      ))}
    </div>
  );
}

export default ExpenseList;