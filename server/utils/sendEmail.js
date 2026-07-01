const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, html) => {
  try {
    const data = await resend.emails.send({
      from: "Expense Tracker <onboarding@resend.dev>",
      to: [to],
      subject,
      html,
    });

    console.log("Email sent successfully:", data);
  } catch (error) {
    console.error("Resend Error:", error);
    throw error;
  }
};

module.exports = sendEmail;