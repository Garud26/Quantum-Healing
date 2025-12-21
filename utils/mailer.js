const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", 
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER, 
    pass: process.env.MAIL_PASS, 
  },
});

const sendMail = async ({ to, subject, html }) => {
  return transporter.sendMail({
    from: `"Appointment System" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html,
  });
};

module.exports = sendMail;
