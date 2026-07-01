const brevo = require("@getbrevo/brevo");

const apiInstance = new brevo.TransactionalEmailsApi();
console.log("API KEY:", process.env.BREVO_API_KEY?.substring(0, 15));

apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

const sendEmail = async (to, subject, html) => {
  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.sender = {
      name: "Expense Tracker",
      email: "jagadeesh200510@gmail.com", // Your verified sender
    };

    sendSmtpEmail.to = [
      {
        email: to,
      },
    ];

    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = html;

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log("Email sent successfully!");
    console.log(response);
  } catch (error) {
    console.error("Brevo Error:");
    console.error(error);
    throw error;
  }
};

module.exports = sendEmail;