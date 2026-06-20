const express = require("express");
const router = express.Router();

const Expense = require("../models/Expense");

router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const expense = await Expense.create(req.body);
    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);

    res.json({
      message: "Expense Deleted"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedExpense =
      await Expense.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    res.json(updatedExpense);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
router.get("/summary/total", async (req, res) => {
  try {
    const expenses = await Expense.find();

    const total = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    res.json({ total });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
router.get("/summary/category", async (req, res) => {
  try {
    const expenses = await Expense.find();

    const categories = {};

    expenses.forEach((expense) => {
      if (categories[expense.category]) {
        categories[expense.category] += expense.amount;
      } else {
        categories[expense.category] = expense.amount;
      }
    });

    res.json(categories);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
router.get("/summary/highest", async (req, res) => {
  try {
    const highestExpense = await Expense.findOne()
      .sort({ amount: -1 });

    res.json({
      highest: highestExpense.amount
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
router.get("/summary/count", async (req, res) => {
  try {
    const count =
      await Expense.countDocuments();

    res.json({ count });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
router.get("/recent", async (req, res) => {
  try {
    const expenses =
      await Expense.find()
      .sort({ date: -1 })
      .limit(5);

    res.json(expenses);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;