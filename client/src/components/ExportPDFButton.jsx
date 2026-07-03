import { FaFilePdf } from "react-icons/fa";
import expenseAPI from "../services/expenseApi";
import budgetAPI from "../services/budgetApi";
import exportPDF from "../utils/exportPDF";
import toast from "react-hot-toast";
import "../styles/ExportButton.css";
function ExportPDFButton() {

  const handleExport = async () => {

    try {

      const [
        expensesRes,
        totalRes,
        countRes,
        highestRes,
        budgetRes
      ] = await Promise.all([
        expenseAPI.get("/"),
        expenseAPI.get("/summary/total"),
        expenseAPI.get("/summary/count"),
        expenseAPI.get("/summary/highest"),
        budgetAPI.get("/")
      ]);

      exportPDF(
  expensesRes.data,
  {
    total: totalRes.data.total,
    count: countRes.data.count,
    highest: highestRes.data.highest
  },
  budgetRes.data.budget,
  localStorage.getItem("userName")
);

      toast.success(
        "PDF Downloaded Successfully"
      );

    } catch (error) {

  console.error("PDF Export Error:", error);

  if (error.response) {
    console.log(error.response.data);
  }

  toast.error("Unable to Export PDF");

}

  };

  return (

    <button
      className="export-btn"
      onClick={handleExport}
    >
      <FaFilePdf />

      Export PDF

    </button>

  );

}

export default ExportPDFButton;