require('dotenv').config();
const nodemailer = require('nodemailer');

console.log("Using USER:", process.env.EMAIL_USER);
console.log("Using PASS:", process.env.EMAIL_PASS ? "****" + process.env.EMAIL_PASS.slice(-4) : "MISSING");

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const mailOptions = {
  from: '"HR Nexus Test" <hr.nexus.noreply@gmail.com>',
  to: process.env.EMAIL_USER, // send to self as a test
  subject: "Test Email from HR Nexus",
  text: "If you receive this, Nodemailer is working."
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error("EMAIL SENDING FAILED:", error);
  } else {
    console.log("EMAIL SENT SUCCESSFULLY! ID:", info.messageId);
  }
  process.exit();
});
