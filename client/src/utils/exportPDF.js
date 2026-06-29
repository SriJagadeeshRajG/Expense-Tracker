import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const exportPDF = (
  expenses,
  summary,
  budget,
  userName
) => {

  const doc = new jsPDF();

  // Title
  doc.setFontSize(22);
  doc.setTextColor(37, 99, 235);
  doc.text(
    "Expense Tracker Report",
    105,
    18,
    { align: "center" }
  );

  // User Details
  doc.setFontSize(12);
  doc.setTextColor(80);

  doc.text(
    `User : ${userName}`,
    14,
    32
  );

  doc.text(
    `Generated : ${new Date().toLocaleDateString()}`,
    14,
    40
  );

  // Table

  autoTable(doc, {
    startY: 50,

    head: [
      [
        "Title",
        "Category",
        "Amount",
        "Date",
      ],
    ],

    body: expenses.map((expense) => [
      expense.title,
      expense.category,
      `₹${expense.amount}`,
      new Date(
        expense.date
      ).toLocaleDateString(),
    ]),
  });

  const finalY =
    doc.lastAutoTable.finalY + 15;

  doc.setFontSize(14);

  doc.text(
    `Total Expense : ₹${summary.total}`,
    14,
    finalY
  );

  doc.text(
    `Total Records : ${summary.count}`,
    14,
    finalY + 10
  );

  doc.text(
    `Highest Expense : ₹${summary.highest}`,
    14,
    finalY + 20
  );

  doc.text(
    `Monthly Budget : ₹${budget}`,
    14,
    finalY + 30
  );

  doc.text(
    `Remaining : ₹${
      budget - summary.total
    }`,
    14,
    finalY + 40
  );

  doc.save("Expense_Report.pdf");
};

export default exportPDF;