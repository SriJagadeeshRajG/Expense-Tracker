const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();
const authMiddleware =
  require("../middleware/authMiddleware");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

/* REGISTER */

router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password
    } = req.body;

    const existingUser =
      await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user =
      await User.create({
        name,
        email,
        password: hashedPassword
      });

    res.status(201).json({
      message: "User Registered Successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

/* LOGIN */

router.post("/login", async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body;

    const user =
      await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid Credentials"
      });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Credentials"
      });
    }

    const token = jwt.sign(
      {
        id: user._id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    res.json({
      token,
      name: user.name,
      email: user.email
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
/* FORGOT PASSWORD */

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    // Don't reveal whether the email exists
    if (!user) {
      return res.json({
        message:
          "If an account exists with that email, a reset link will be sent.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes

    await user.save();

    // Temporary: print the link to the terminal
    const resetLink =
  `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

await sendEmail(
  user.email,
  "Reset your Expense Tracker Password",
  `
  <div style="
      font-family:Arial;
      max-width:600px;
      margin:auto;
      padding:30px;
      background:#111827;
      color:white;
      border-radius:20px;
  ">

      <h1 style="color:#60a5fa;">
          Expense Tracker
      </h1>

      <p>
          We received a request to reset your password.
      </p>

      <p>
          Click the button below to create a new password.
      </p>

      <a
      href="${resetLink}"
      style="
      display:inline-block;
      margin-top:20px;
      background:#2563eb;
      color:white;
      text-decoration:none;
      padding:14px 24px;
      border-radius:12px;
      font-weight:bold;
      ">
      Reset Password
      </a>

      <p style="margin-top:35px;color:#9ca3af;">
          This link expires in 15 minutes.
      </p>

      <hr>

      <small style="color:#6b7280;">
          If you didn't request this, you can safely ignore this email.
      </small>

  </div>
  `
);

    res.json({
  message: "Password reset email sent successfully.",
});

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
/* RESET PASSWORD */

router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset link",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({
      message: "Password reset successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
/* UPDATE USERNAME */

router.put(
  "/profile",
  authMiddleware,
  async (req, res) => {
    try {
      const { name } = req.body;

      if (!name || !name.trim()) {
        return res.status(400).json({
          message: "Name is required",
        });
      }

      const user = await User.findById(req.user);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      user.name = name.trim();

      await user.save();

      res.json({
        message: "Username updated successfully",
        name: user.name,
      });

    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);
/* CHANGE PASSWORD */

router.put(
  "/change-password",
  authMiddleware,
  async (req, res) => {
    try {
      const {
        currentPassword,
        newPassword,
      } = req.body;

      const user = await User.findById(req.user);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const isMatch = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!isMatch) {
        return res.status(400).json({
          message: "Current password is incorrect",
        });
      }

      user.password = await bcrypt.hash(
        newPassword,
        10
      );

      await user.save();

      res.json({
        message: "Password updated successfully",
      });

    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  }
);
router.get(
  "/budget",
  authMiddleware,
  async (req, res) => {
    try {
      const user =
        await User.findById(
  req.user
);

      res.json({
        budget: user.budget
      });

    } catch (error) {
      res.status(500).json({ 
        message: error.message
      });
    }
  }
);
router.put(
  "/budget",
  authMiddleware,
  async (req, res) => {
    try {
      const { budget } = req.body;

      const user =
        await User.findByIdAndUpdate(
  req.user,
          { budget },
          { new: true }
        );

      res.json({
        budget: user.budget
      });

    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  }
);
module.exports = router;