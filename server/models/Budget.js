const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },

  amount: {
    type: Number,
    required: true,
    default: 5000,
  },
});

module.exports = mongoose.model(
  "Budget",
  BudgetSchema
);