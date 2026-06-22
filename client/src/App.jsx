import { useState } from "react";
import ExpenseForm from "./components/ExpenseForm";
import Summary from "./components/Summary";
import ExpenseList from "./components/ExpenseList";
import "./styles/App.css";

function App() {
  const [refresh, setRefresh] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const refreshExpenses = () => {
    setRefresh((prev) => !prev);
  };

  return (
    <div lassName="app-container">
      <h1>Expense Tracker</h1>

      <ExpenseForm
        refreshExpenses={refreshExpenses}
        editingExpense={editingExpense}
        setEditingExpense={setEditingExpense}
      />

      <Summary refresh={refresh} />

      <ExpenseList
        refresh={refresh}
        refreshExpenses={refreshExpenses}
        setEditingExpense={setEditingExpense}
      />
    </div>
  );
}

export default App;