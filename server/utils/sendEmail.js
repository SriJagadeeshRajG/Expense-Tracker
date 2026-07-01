const brevo = require("@getbrevo/brevo");

const apiInstance = new brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

const sendEmail = async (to, subject, html) => {
  try {
    const email = new brevo.SendSmtpEmail();

    email.sender = {
      name: "Expense Tracker",
      email: "jagadeesh200510@gmail.com", // Must be your verified sender
    };

    email.to = [
      {
        email: to,
      },
    ];

    email.subject = subject;
    email.htmlContent = html;

    const result = await apiInstance.sendTransacEmail(email);

    console.log("Email sent successfully");
    console.log(result);
  } catch (err) {
    console.error("Brevo Error:");
    console.error(err);
    throw err;
  }
};

module.exports = sendEmail;