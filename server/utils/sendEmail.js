const brevo = require("@getbrevo/brevo");

console.log(
  "API KEY:",
  process.env.BREVO_API_KEY?.substring(0, 15)
);

const apiInstance = new brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

const sendEmail = async (to, subject, html) => {
  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.sender = {
      name: "Expense Tracker",
      email: "jagadeesh200510@gmail.com",
    };

    sendSmtpEmail.to = [
      {
        email: to,
      },
    ];

    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = html;

    const response = await apiInstance.sendTransacEmail(
      sendSmtpEmail
    );

    console.log("✅ Email sent successfully!");
    console.log(response);

    return response;
  } catch (error) {
    console.error("========== BREVO ERROR ==========");

    console.error("Status Code:");
    console.error(error.response?.status);

    console.error("Response Data:");
    console.error(
      JSON.stringify(error.response?.data, null, 2)
    );

    console.error("Full Error:");
    console.error(error);

    console.error("================================");

    throw error;
  }
};

module.exports = sendEmail;