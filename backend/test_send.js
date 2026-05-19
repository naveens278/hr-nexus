const mysql = require('mysql2/promise');
const nodemailer = require('nodemailer');
require('dotenv').config();

async function testSendLeave() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hr_nexus_db'
  });

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER || 'hr.nexus.noreply@gmail.com',
      pass: process.env.EMAIL_PASS || 'your-app-password'
    }
  });

  try {
    // Manually fetch the first approved leave
    const [rows] = await pool.query(`
      SELECT lr.*, e.email, e.firstName 
      FROM leaves_request lr 
      JOIN employees e ON lr.employeeId = e.id 
      LIMIT 1
    `);

    if (rows.length > 0) {
      const { email, firstName, employeeName, leaveType, startDate, endDate, STATUS: status, rejection_reason: rejectionReason } = rows[0];
      const targetEmail = email || rows[0].EMAIL;
      const targetName = firstName || employeeName || 'Employee';

      const mailOptions = {
        from: `"HR Nexus Admin" <${process.env.EMAIL_USER || 'hr.nexus.noreply@gmail.com'}>`,
        to: targetEmail,
        subject: `Leave Request ${status.toUpperCase()} - ${targetName}`,
        text: `Testing send. To: ${targetEmail}, From: ${process.env.EMAIL_USER}`
      };

      console.log(`[EMAIL_SERVICE] Sending email to: ${targetEmail}`);
      if (transporter.options.auth.pass !== 'your-app-password') {
        const info = await transporter.sendMail(mailOptions);
        console.log(`[EMAIL_SERVICE] Email sent successfully! ID: ${info.messageId}`);
      } else {
        console.log("[EMAIL_SERVICE] Skipping actual send - placeholders in use.");
      }
    } else {
      console.log("No leaves found in DB");
    }
  } catch (error) {
    console.error('[EMAIL_SERVICE] Error:', error);
  } finally {
    process.exit();
  }
}

testSendLeave();
