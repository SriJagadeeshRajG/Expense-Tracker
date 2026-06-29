const mongoose = require("mongoose");
const Expense = require("../models/Expense");
require("dotenv").config();

const formatCategory = (text) => {
  const cleaned = text.trim().toLowerCase();

  const categoryMap = {
    food: "Food",
    travel: "Travel",
    drinks: "Drinks",
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
        word =>
          word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(" ")
  );
};

async function fixCategories() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const expenses = await Expense.find();

    for (const expense of expenses) {
      expense.category = formatCategory(expense.category);
      await expense.save();
    }

    console.log("✅ All categories cleaned successfully!");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

fixCategories();