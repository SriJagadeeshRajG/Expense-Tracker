const express = require("express");
const router = express.Router();

const Budget = require("../models/Budget");
const authMiddleware = require("../middleware/authMiddleware");

/* GET BUDGET */

router.get("/", authMiddleware, async (req, res) => {
  try {

    let budget = await Budget.findOne({
      user: req.user,
    });

    if (!budget) {

      budget = await Budget.create({
        user: req.user,
        amount: 5000,
      });

    }

    res.json(budget);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
});

/* UPDATE BUDGET */

router.put("/", authMiddleware, async (req, res) => {

  try {

    const { amount } = req.body;

    let budget = await Budget.findOne({
      user: req.user,
    });

    if (!budget) {

      budget = await Budget.create({
        user: req.user,
        amount,
      });

    } else {

      budget.amount = amount;
      await budget.save();

    }

    res.json(budget);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

});

module.exports = router;