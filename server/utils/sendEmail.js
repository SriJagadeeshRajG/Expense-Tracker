const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

const sendEmail = async (to, subject, html) => {
  try {
    console.log("Verifying transporter...");

    await transporter.verify();

    console.log("Transport verified");

    const info = await transporter.sendMail({
      from: `"Expense Tracker" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent:", info.messageId);
  } catch (err) {
    console.error("FULL EMAIL ERROR:");
    console.error(err);
    throw err;
  }
};

module.exports = sendEmail;