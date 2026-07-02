const express = require("express");
const router = express.Router();

const Expense = require("../models/Expense");
const authMiddleware =
  require("../middleware/authMiddleware");

/* GET ALL EXPENSES */

router.get(
  "/",
  authMiddleware,
  async (req, res) => {
    try {
      const expenses =
        await Expense.find({
          user: req.user.id
        });

      res.json(expenses);

    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  }
);
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
          word.charAt(0).toUpperCase() +
          word.slice(1)
      )
      .join(" ")
  );
};

/* ADD EXPENSE */

router.post(
  "/",
  authMiddleware,
  async (req, res) => {
    try {

      console.log("========== ADD EXPENSE ==========");
      console.log("Authorization Header:", req.header("Authorization"));
      console.log("Decoded User:", req.user);
      console.log("Request Body:", req.body);

      const expense = await Expense.create({
        user: req.user.id,
        title: req.body.title,
        amount: Number(req.body.amount),
        category: formatCategory(req.body.category),
      });

      console.log("Expense Saved:", expense);
      console.log("================================");

      res.status(201).json(expense);

    } catch (error) {

      console.log("========== ERROR ==========");
      console.log(error);
      console.log("===========================");

      res.status(400).json({
        message: error.message,
      });

    }
  }
);

/* DELETE */

router.delete(
  "/:id",
  authMiddleware,
  async (req, res) => {
    try {
      await Expense.findOneAndDelete({
        _id: req.params.id,
        user: req.user.id
      });

      res.json({
        message: "Expense Deleted"
      });

    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  }
);

/* UPDATE */

router.put(
  "/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const updatedExpense =
        await Expense.findOneAndUpdate(
          {
            _id: req.params.id,
            user: req.user
          },
          {
  ...req.body,
  category: formatCategory(req.body.category),
},
          { new: true }
        );

      res.json(updatedExpense);

    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  }
);

/* TOTAL */

router.get(
  "/summary/total",
  authMiddleware,
  async (req, res) => {
    try {
      const expenses =
        await Expense.find({
          user: req.user.id
        });

      const total =
        expenses.reduce(
          (sum, expense) =>
            sum + expense.amount,
          0
        );

      res.json({ total });

    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  }
);

/* CATEGORY */

router.get(
  "/summary/category",
  authMiddleware,
  async (req, res) => {
    try {
      const expenses =
        await Expense.find({
          user: req.user.id
        });

      const categories = {};

      expenses.forEach(
        (expense) => {
          if (
            categories[
              expense.category
            ]
          ) {
            categories[
              expense.category
            ] += expense.amount;
          } else {
            categories[
              expense.category
            ] = expense.amount;
          }
        }
      );

      res.json(categories);

    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  }
);

/* HIGHEST */

router.get(
  "/summary/highest",
  authMiddleware,
  async (req, res) => {
    try {
      const highestExpense =
        await Expense.findOne({
          user: req.user.id
        }).sort({
          amount: -1
        });

      if (!highestExpense) {
        return res.json({
          highest: 0
        });
      }

      res.json({
        highest:
          highestExpense.amount
      });

    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  }
);

/* COUNT */

router.get(
  "/summary/count",
  authMiddleware,
  async (req, res) => {
    try {
      const count =
        await Expense.countDocuments(
          {
            user: req.user.id
          }
        );

      res.json({ count });

    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  }
);

/* RECENT */

router.get(
  "/recent",
  authMiddleware,
  async (req, res) => {
    try {
      const expenses =
        await Expense.find({
          user: req.user.id
        })
          .sort({
            date: -1
          })
          .limit(5);

      res.json(expenses);

    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  }
);

module.exports = router;