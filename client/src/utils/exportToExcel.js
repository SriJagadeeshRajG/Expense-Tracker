import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportExpensesToExcel = (expenses) => {
  if (!expenses.length) return;

  const data = expenses.map((expense) => ({
    Title: expense.title,
    Category: expense.category,
    Amount: `₹${expense.amount}`,
    Date: new Date(expense.date).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    ),
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);

  worksheet["!cols"] = [
    { wch: 25 },
    { wch: 20 },
    { wch: 15 },
    { wch: 18 },
  ];

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Expenses"
  );

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob([excelBuffer], {
    type:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });

  saveAs(
    blob,
    `Expenses_${new Date().toLocaleDateString("en-GB")}.xlsx`
  );
};