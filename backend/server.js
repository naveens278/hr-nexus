const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const JWT_SECRET = 'hr_nexus_super_secret_key_123';
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com'; // Replace with real Client ID
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

const app = express();
app.use(cors());
app.use(express.json());

if (!fs.existsSync('uploads')) { fs.mkdirSync('uploads'); }

const storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, 'uploads/') },
  filename: function (req, file, cb) { cb(null, 'profile-' + req.params.id + '-' + Date.now() + path.extname(file.originalname)) }
});
const upload = multer({ storage: storage });

app.use('/uploads', express.static('uploads'));

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'hr_nexus_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
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

const sendLeaveEmail = async (leaveId, status, rejectionReason = '') => {
  try {
    const [rows] = await pool.query(`
      SELECT lr.*, e.email, e.firstName 
      FROM leaves_request lr 
      JOIN employees e ON lr.employeeId = e.id 
      WHERE lr.id = ?
    `, [leaveId]);

    if (rows.length > 0) {
      const { email, firstName, employeeName, leaveType, startDate, endDate } = rows[0];
      const targetEmail = email || rows[0].EMAIL; // Fallback to DB casing if needed
      const targetName = firstName || employeeName || 'Employee';

      const mailOptions = {
        from: `"HR Nexus Admin" <${process.env.EMAIL_USER || 'hr.nexus.noreply@gmail.com'}>`,
        to: targetEmail,
        subject: `Leave Request ${status.toUpperCase()} - ${targetName}`,
        html: `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; padding: 30px; color: #333; border: 1px solid #667eea; border-radius: 15px; max-width: 600px; background: #fff; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 25px;">
              <h1 style="color: #667eea; margin: 0; font-size: 28px;">HR Nexus</h1>
              <p style="color: #718096; margin: 5px 0;">Official Platform Notification</p>
            </div>
            
            <div style="border-top: 2px solid #e2e8f0; padding-top: 25px;">
              <h2 style="color: #2d3748; font-size: 20px; margin-bottom: 15px;">Leave Request Update</h2>
              <p>Hello <strong>${targetName}</strong>,</p>
              <p>Your leave request has been processed with the following status:</p>
              
              <div style="background: ${status === 'approved' ? '#f0fdf4' : status === 'cancelled' ? '#fffbeb' : '#fef2f2'}; padding: 20px; border-radius: 10px; border: 1px solid ${status === 'approved' ? '#bcf0da' : status === 'cancelled' ? '#fde68a' : '#f8b4b4'}; margin: 25px 0;">
                <p style="margin: 5px 0;"><strong>Type:</strong> ${leaveType}</p>
                <p style="margin: 5px 0;"><strong>Period:</strong> ${startDate} to ${endDate}</p>
                <p style="margin: 15px 0 5px 0; font-size: 18px;"><strong>Status:</strong> <span style="color: ${status === 'approved' ? '#16a34a' : status === 'cancelled' ? '#d97706' : '#dc2626'}; font-weight: bold; text-transform: uppercase;">${status}</span></p>
                ${rejectionReason ? `<div style="margin-top: 15px; padding-top: 15px; border-top: 1px dashed ${status === 'cancelled' ? '#fde68a' : '#f8b4b4'}; color: ${status === 'cancelled' ? '#b45309' : '#991b1b'};"><strong>Reason:</strong> ${rejectionReason}</div>` : ''}
              </div>
              
              ${status === 'approved' ? `<p style="color: #4a5568;">You can now view your updated leave history in the platform.</p>` : `<p style="color: #4a5568;">If you have any questions, please contact your manager.</p>`}
            </div>
            
            <div style="margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 20px; text-align: center; color: #a0aec0; font-size: 12px;">
              <p>This is an automated notification from HR Nexus Enterprise. Please do not reply to this email.</p>
              <p>© 2026 HR Nexus. All rights reserved.</p>
            </div>
          </div>
        `
      };
      
      console.log(`[EMAIL_SERVICE] Sending ${status} email to: ${targetEmail}`);
      // Only attempt to send if configured
      if (transporter.options.auth.pass !== 'your-app-password') {
        await transporter.sendMail(mailOptions);
        console.log(`[EMAIL_SERVICE] Email sent successfully to: ${targetEmail}`);
      } else {
        console.log("[EMAIL_SERVICE] Skipping actual send - placeholders in use.");
      }
    }
  } catch (error) {
    console.error('[EMAIL_SERVICE] Error in sendLeaveEmail:', error);
  }
};

const sendPayrollEmail = async (employee, month, payroll) => {
  try {
    const crypto = require('crypto');
    const targetEmail = employee.email;
    if (!targetEmail) return;

    const targetName = `${employee.firstName || ''} ${employee.lastName || ''}`.trim() || 'Employee';
    const { basic, hra, da, net } = payroll;
    
    // Stable Generation ID
    const stableIdSuffix = crypto.createHash('md5').update(targetEmail + month).digest('hex').substring(0, 6).toUpperCase();
    const generationId = `HRN-${month.replace('-', '')}-${employee.id}-${stableIdSuffix}`;
    
    // Bank/Account Placeholders
    const bankName = "HDFC Bank Ltd.";
    const accountNumber = `XXXXXX${String(employee.id * 7).substring(0,4)}`;

    const mailOptions = {
      from: `"HR-NEXUS Enterprise" <${process.env.EMAIL_USER || 'hr.nexus.noreply@gmail.com'}>`,
      to: targetEmail,
      subject: `Verified Payslip: ${month} - ${targetName}`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f1f5f9; padding: 40px 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 12px 40px rgba(0,0,0,0.1); border: 1px solid #e2e8f0;">
            
            <!-- Ultra-Premium Header -->
            <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 50px 30px; text-align: center; color: #ffffff;">
              <h1 style="margin: 0; font-size: 32px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase;">HR-NEXUS</h1>
              <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9; font-weight: 600; letter-spacing: 1px;">PREMIUM PAYROLL MANAGEMENT</p>
              
              <div style="margin-top: 25px; display: inline-block; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.25); padding: 10px 25px; border-radius: 100px;">
                <span style="font-size: 13px; font-weight: 700; color: #ffffff;">MONTHLY STATEMENT: ${month}</span>
              </div>
            </div>

            <!-- Verified Badge -->
            <div style="text-align: center; margin-top: -20px;">
              <div style="display: inline-block; background: #ffffff; padding: 5px 20px; border-radius: 50px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
                <span style="color: #059669; font-size: 13px; font-weight: 800; display: flex; align-items: center; gap: 5px;">
                  <span style="font-size: 16px;">✓</span> VERIFIED PAYMENT
                </span>
              </div>
            </div>

            <div style="padding: 40px 30px;">
              <!-- Welcome Content -->
              <p style="margin: 0 0 25px 0; color: #1e293b; font-size: 16px; font-weight: 500;">Hello <strong>${targetName}</strong>,</p>
              <p style="margin: 0 0 30px 0; color: #64748b; font-size: 14px; line-height: 1.6;">Your payroll for the month of <strong>${month}</strong> has been successfully processed and verified. Below is the detailed breakdown of your statement.</p>

              <!-- Sections Row -->
              <table style="width: 100%; margin-bottom: 30px;">
                <tr>
                  <td style="width: 50%; vertical-align: top; padding-right: 15px;">
                    <div style="background-color: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #f1f5f9;">
                      <h4 style="margin: 0 0 12px 0; color: #4f46e5; font-size: 12px; text-transform: uppercase;">Personnel Details</h4>
                      <p style="margin: 5px 0; font-size: 13px; color: #475569;"><strong>ID:</strong> EMP-${String(employee.id).padStart(4, '0')}</p>
                      <p style="margin: 5px 0; font-size: 13px; color: #475569;"><strong>Dept:</strong> ${employee.department || 'Engineering'}</p>
                      <p style="margin: 5px 0; font-size: 13px; color: #475569;"><strong>Role:</strong> ${employee.position || 'Staff Associate'}</p>
                    </div>
                  </td>
                  <td style="width: 50%; vertical-align: top; padding-left: 15px;">
                    <div style="background-color: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #f1f5f9;">
                      <h4 style="margin: 0 0 12px 0; color: #4f46e5; font-size: 12px; text-transform: uppercase;">Payment Info</h4>
                      <p style="margin: 5px 0; font-size: 13px; color: #475569;"><strong>Bank:</strong> ${bankName}</p>
                      <p style="margin: 5px 0; font-size: 13px; color: #475569;"><strong>Acc:</strong> ${accountNumber}</p>
                      <p style="margin: 5px 0; font-size: 13px; color: #475569;"><strong>ID:</strong> ${generationId.split('-').pop()}</p>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Main Table -->
              <div style="border: 2px solid #f8fafc; border-radius: 15px; overflow: hidden; margin-bottom: 30px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr style="background-color: #f8fafc; border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 15px 20px; color: #64748b; font-size: 14px; font-weight: 700;">EARNINGS BREAKDOWN</td>
                    <td style="padding: 15px 20px; text-align: right; color: #64748b; font-size: 14px; font-weight: 700;">AMOUNT (INR)</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 20px; color: #475569; font-size: 14px;">Basic Monthly Salary</td>
                    <td style="padding: 12px 20px; text-align: right; color: #1e293b; font-weight: 700; font-size: 14px;">₹${basic.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 20px; color: #475569; font-size: 14px;">House Rent Allowance</td>
                    <td style="padding: 12px 20px; text-align: right; color: #1e293b; font-weight: 700; font-size: 14px;">₹${hra.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 20px; color: #475569; font-size: 14px;">Dearness Allowance</td>
                    <td style="padding: 12px 20px; text-align: right; color: #1e293b; font-weight: 700; font-size: 14px;">₹${da.toLocaleString()}</td>
                  </tr>
                  <tr style="border-top: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9; background-color: #eeefff;">
                    <td style="padding: 15px 20px; color: #4f46e5; font-size: 14px; font-weight: 800;">TOTAL NET SALARY</td>
                    <td style="padding: 15px 20px; text-align: right; color: #4f46e5; font-weight: 900; font-size: 20px;">₹${net.toLocaleString()}</td>
                  </tr>
                </table>
              </div>

              <!-- Extra Note -->
              <div style="background-color: #ecfdf5; border: 1px solid #d1fae5; border-radius: 12px; padding: 20px; text-align: center;">
                <p style="margin: 0; color: #065f46; font-size: 13px; font-weight: 600;">Funds will be credited to your registered bank account within 24-48 hours.</p>
              </div>

              <!-- Footer Section -->
              <div style="margin-top: 40px; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 30px;">
                <p style="margin: 0; color: #94a3b8; font-size: 11px; letter-spacing: 0.5px;">This is an automated encrypted notification from HR-NEXUS Enterprise Management.</p>
                <p style="margin: 5px 0 0 0; color: #94a3b8; font-size: 11px; font-weight: 800; text-transform: uppercase;">© 2026 HR-NEXUS INC • GLOBAL SOLUTIONS</p>
              </div>
            </div>
          </div>
        </div>
      `
    };
    
    console.log(`[EMAIL_SERVICE] Sending ultra-premium payroll email to: ${targetEmail}`);
    if (transporter.options.auth.pass !== 'your-app-password') {
      await transporter.sendMail(mailOptions);
      console.log(`[EMAIL_SERVICE] Email sent successfully to: ${targetEmail}`);
    } else {
      console.log("[EMAIL_SERVICE] Skipping actual send - placeholders in use.");
    }
  } catch (error) {
    console.error('[EMAIL_SERVICE] Error in sendPayrollEmail:', error);
  }
};

const sendSMS = async (phone, message) => {
  try {
    const logDir = path.join(__dirname, 'logs');
    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
    const logPath = path.join(logDir, 'sms_logs.txt');
    const apiLogPath = path.join(logDir, 'sms_api_debug.txt');
    
    const timestamp = new Date().toLocaleString();
    const logEntry = `[${timestamp}] TO: ${phone} | MESSAGE: ${message}\n`;
    fs.appendFileSync(logPath, logEntry);

    const defaultProvider = (process.env.ANDROID_GW_API_URL && process.env.ANDROID_GW_API_TOKEN) ? 'android' : 'fast2sms';
    const provider = (process.env.SMS_PROVIDER || defaultProvider).toLowerCase();
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    const axios = require('axios');

    if (provider === 'android') {
      const apiUrl = process.env.ANDROID_GW_API_URL; // e.g., https://android-sms-gateway.com/api/v1
      const apiToken = process.env.ANDROID_GW_API_TOKEN;
      
      if (apiUrl && apiToken) {
        console.log(`[SMS_SERVICE] Sending to ${cleanPhone} via Android Gateway...`);
        const response = await axios({
          method: 'POST',
          url: `${apiUrl}/message`,
          data: { 
            to: `+91${cleanPhone}`, 
            message: message 
          },
          headers: { 
            'Authorization': `Bearer ${apiToken}`,
            'Content-Type': 'application/json' 
          }
        });
        fs.appendFileSync(apiLogPath, `[${timestamp}] ANDROID_GW SUCCESS: ${JSON.stringify(response.data)}\n`);
        return true;
      }
    } else if (provider === 'messagebot') {
      const apiKey = process.env.MESSAGEBOT_API_KEY;
      if (apiKey) {
        console.log(`[SMS_SERVICE] Sending to ${cleanPhone} via MessageBot...`);
        const response = await axios.get(`https://api.messagebot.in/v1/sms/send`, {
          params: { authkey: apiKey, mobile: cleanPhone, message: message, sender: 'MSGBCN', route: '4' }
        });
        fs.appendFileSync(apiLogPath, `[${timestamp}] MESSAGEBOT RESPONSE: ${JSON.stringify(response.data)}\n`);
        return response.data.type === 'success';
      }
    } else if (provider === 'mtalkz') {
      const apiKey = process.env.MTALKZ_API_KEY;
      const sender = process.env.MTALKZ_SENDER_ID || 'MTALKZ';
      if (apiKey) {
        console.log(`[SMS_SERVICE] Sending to ${cleanPhone} via Mtalkz...`);
        const response = await axios.get(`https://api.mtalkz.com/v1/sms/send`, {
          params: { apikey: apiKey, sender: sender, mobile: cleanPhone, message: message }
        });
        fs.appendFileSync(apiLogPath, `[${timestamp}] MTALKZ RESPONSE: ${JSON.stringify(response.data)}\n`);
        return response.data.status === 'success';
      }
    } else if (provider === 'twilio') {
      const sid = process.env.TWILIO_ACCOUNT_SID;
      const token = process.env.TWILIO_AUTH_TOKEN;
      const from = process.env.TWILIO_PHONE_NUMBER;
      
      if (sid && token && from) {
        console.log(`[SMS_SERVICE] Sending to ${cleanPhone} via Twilio...`);
        const auth = Buffer.from(`${sid}:${token}`).toString('base64');
        const qs = require('qs');
        const response = await axios({
          method: 'POST',
          url: `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
          data: qs.stringify({ To: `+91${cleanPhone}`, From: from, Body: message }),
          headers: { 'Authorization': `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        fs.appendFileSync(apiLogPath, `[${timestamp}] TWILIO SUCCESS: ${JSON.stringify(response.data.sid)}\n`);
        return true;
      }
    } else if (provider === 'msg91') {
      const authKey = process.env.MSG91_AUTH_KEY;
      const templateId = process.env.MSG91_TEMPLATE_ID;
      if (authKey) {
        console.log(`[SMS_SERVICE] Sending to ${cleanPhone} via Msg91...`);
        const response = await axios({
          method: 'POST',
          url: 'https://api.msg91.com/api/v5/otp',
          data: { template_id: templateId, mobile: `91${cleanPhone}`, authkey: authKey, [message.includes('Payroll') ? 'payload' : 'var1']: message }
        });
        fs.appendFileSync(apiLogPath, `[${timestamp}] MSG91 RESPONSE: ${JSON.stringify(response.data)}\n`);
        return response.data.type === 'success';
      }
    } else {
      const apiKey = (process.env.FAST2SMS_API_KEY || '').trim();
      if (apiKey && apiKey !== 'YOUR_API_KEY') {
        const payload = { route: 'q', message: message, numbers: cleanPhone };
        console.log(`[SMS_SERVICE] Sending to ${cleanPhone} via Fast2SMS (q)...`);
        const response = await axios({
          method: 'POST',
          url: 'https://www.fast2sms.com/dev/bulkV2',
          data: payload,
          headers: { 'authorization': apiKey }
        });
        fs.appendFileSync(apiLogPath, `[${timestamp}] FAST2SMS RESPONSE: ${JSON.stringify(response.data)}\n`);
        return response.data.return;
      }
    }

    console.log(`[SMS_SERVICE] SIMULATION MODE (No valid provider config). Message logged.`);
    return true;
  } catch (error) {
    const apiLogPath = path.join(__dirname, 'logs', 'sms_api_debug.txt');
    const timestamp = new Date().toLocaleString();
    const errData = error.response ? JSON.stringify(error.response.data) : error.message;
    fs.appendFileSync(apiLogPath, `[${timestamp}] GLOBAL_SMS_ERROR: ${errData}\n`);
    console.error('[SMS_SERVICE] ERROR:', error.message);
    return false;
  }
};

// Setup Users Table
(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        uid VARCHAR(100) UNIQUE,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255),
        name VARCHAR(255),
        role VARCHAR(50) DEFAULT 'employee',
        department VARCHAR(100),
        phone VARCHAR(50),
        photoURL VARCHAR(500),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        lastLogin TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        isActive BOOLEAN DEFAULT true,
        authProvider VARCHAR(50) DEFAULT 'local'
      )
    `);

    // Add columns if they are missing due to the table already existing
    try { await pool.query("ALTER TABLE users ADD COLUMN uid VARCHAR(100) UNIQUE"); } catch(e) {}
    try { await pool.query("ALTER TABLE users ADD COLUMN authProvider VARCHAR(50) DEFAULT 'local'"); } catch(e) {}
    try { await pool.query("ALTER TABLE users ADD COLUMN photoURL VARCHAR(500)"); } catch(e) {}
    
    console.log("Users table verified");

    // Setup Leaves Request Table Columns (Add if missing)
    try {
      await pool.query("ALTER TABLE leaves_request ADD COLUMN employeeName VARCHAR(255)");
    } catch(e) {}
    try {
      await pool.query("ALTER TABLE leaves_request ADD COLUMN department VARCHAR(100)");
    } catch(e) {}
    try {
      await pool.query("ALTER TABLE leaves_request ADD COLUMN position VARCHAR(100)");
    } catch(e) {}
    try {
       await pool.query("ALTER TABLE leaves_request ADD COLUMN rejection_reason TEXT");
    } catch(e) {}
    try {
       await pool.query("ALTER TABLE leaves_request ADD COLUMN cancellation_reason TEXT");
    } catch(e) {}
    
    console.log("Leaves table verified");

    // Setup Payroll Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS payroll (
        id INT AUTO_INCREMENT PRIMARY KEY,
        employeeId INT NOT NULL,
        month VARCHAR(7) NOT NULL,
        basic_salary DECIMAL(10,2) DEFAULT 0,
        hra DECIMAL(10,2) DEFAULT 0,
        da DECIMAL(10,2) DEFAULT 0,
        gross_salary DECIMAL(10,2) DEFAULT 0,
        pf DECIMAL(10,2) DEFAULT 0,
        tax DECIMAL(10,2) DEFAULT 0,
        net_salary DECIMAL(10,2) DEFAULT 0,
        processedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_payroll (employeeId, month),
        FOREIGN KEY (employeeId) REFERENCES employees(id) ON DELETE CASCADE
      )
    `);
    console.log("Payroll table verified");
  } catch (err) {
    console.error("Error setting up database tables:", err);
  }
})();

app.get('/api/test', async (req, res) => {
  res.json({ success: true, message: "Database connected" });
});

// ==========================================
// AUTH API
// ==========================================
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, role, department, phone } = req.body;
    
    if (email !== 'naveensenthil396@gmail.com') {
      return res.status(403).json({ success: false, error: 'Access restricted: Only HR/Admin (naveensenthil396@gmail.com) is authorized.' });
    }

    const [existing] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existing.length > 0) return res.status(400).json({ success: false, error: 'Email already exists' });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const uid = 'local_' + Date.now();
    
    await pool.query(
      "INSERT INTO users (uid, email, password, name, role, department, phone, authProvider) VALUES (?, ?, ?, ?, ?, ?, ?, 'local')",
      [uid, email, hashedPassword, name, role || 'employee', department || '', phone || '']
    );
    
    const [newUser] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    const user = newUser[0];
    delete user.password;
    
    const token = jwt.sign({ id: user.id, uid: user.uid, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, user, token });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (email !== 'naveensenthil396@gmail.com') {
      return res.status(403).json({ success: false, error: 'Access restricted: Only HR/Admin (naveensenthil396@gmail.com) is authorized.' });
    }

    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) return res.status(400).json({ success: false, error: 'User not found' });
    
    const user = users[0];
    if (user.authProvider !== 'local') return res.status(400).json({ success: false, error: `Please login with ${user.authProvider}` });
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ success: false, error: 'Invalid credentials' });
    
    await pool.query("UPDATE users SET lastLogin = NOW() WHERE id = ?", [user.id]);
    delete user.password;
    
    const token = jwt.sign({ id: user.id, uid: user.uid, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, user, token });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

app.post('/api/auth/firebase-google', async (req, res) => {
  try {
    const { email, name, photoURL, uid } = req.body;
    
    if (!email || !uid) {
      return res.status(400).json({ success: false, error: 'Missing Firebase user data' });
    }

    if (email !== 'naveensenthil396@gmail.com') {
      return res.status(403).json({ success: false, error: 'Access restricted: Only HR/Admin (naveensenthil396@gmail.com) is authorized.' });
    }
    
    let [users] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    let user;
    
    if (users.length === 0) {
      await pool.query(
        "INSERT INTO users (uid, email, name, photoURL, role, authProvider) VALUES (?, ?, ?, ?, 'employee', 'google')",
        [uid, email, name, photoURL]
      );
      const [newUsers] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
      user = newUsers[0];
    } else {
      user = users[0];
      await pool.query("UPDATE users SET lastLogin = NOW(), photoURL = ? WHERE id = ?", [photoURL || user.photoURL, user.id]);
    }
    
    delete user.password;
    const authToken = jwt.sign({ id: user.id, uid: user.uid, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, user, token: authToken });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

app.get('/api/auth/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ success: false, error: 'No token passed' });
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const [users] = await pool.query("SELECT * FROM users WHERE id = ?", [decoded.id]);
    if (users.length === 0) return res.status(404).json({ success: false, error: 'User not found' });
    
    const user = users[0];
    delete user.password;
    res.json({ success: true, user });
  } catch (error) { res.status(401).json({ success: false, error: 'Invalid token' }); }
});

// ==========================================
// EMPLOYEES API
// ==========================================
app.get('/api/employees', async (req, res) => {
  try {
    console.log("[BACKEND] Fetching all employees...");
    const [rows] = await pool.query("SELECT * FROM employees ORDER BY id DESC");
    console.log(`[BACKEND] Found ${rows.length} employees.`);
    const mapped = rows.map(r => {
      const pStr = r.position || r.POSITION || '';
      const sStr = r.status || r.STATUS || 'active';
      const etStr = r.employmentType || r.EMPLOYMENTTYPE || 'Full-time';
      const fName = (r.firstName || r.FIRSTNAME || '').trim();
      const lName = (r.lastName || r.LASTNAME || '').trim();
      const dept = (r.department || r.DEPARTMENT || 'Unassigned').trim();
      
      return {
        ...r, 
        firstName: fName,
        lastName: lName,
        department: dept,
        position: pStr.trim(),
        status: sStr.trim().toLowerCase(),
        employmentType: etStr.trim(),
        salary: { 
          basic: parseFloat(r.basic_salary || 0), 
          hra: parseFloat(r.hra || 0), 
          da: parseFloat(r.da || 0) 
        }
      };
    });
    res.json({ success: true, data: mapped });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

app.post('/api/employees', async (req, res) => {
  try {
    const d = req.body;
    const [result] = await pool.query(
      "INSERT INTO employees (firstName, lastName, email, phone, dateOfBirth, gender, department, position, joinDate, basic_salary, hra, da, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [d.firstName, d.lastName, d.email, d.phone, d.dateOfBirth, d.gender, d.department, d.position, d.joinDate, d.salary?.basic || 0, d.salary?.hra || 0, d.salary?.da || 0, d.status || 'active']
    );
    res.json({ success: true, id: result.insertId });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

app.get('/api/employees/count', async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT COUNT(*) as count FROM employees");
    res.json(rows[0].count);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.get('/api/employees/:id', async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM employees WHERE id = ?", [req.params.id]);
    if (rows.length > 0) {
      const r = rows[0];
      const pStr = r.position || r.POSITION || '';
      const sStr = r.status || r.STATUS || 'active';
      const etStr = r.employmentType || r.EMPLOYMENTTYPE || 'Full-time';
      
      res.json({ 
        success: true, 
        data: {
          ...r, 
          firstName: (r.firstName || r.FIRSTNAME || '').trim(),
          lastName: (r.lastName || r.LASTNAME || '').trim(),
          department: (r.department || r.DEPARTMENT || 'Unassigned').trim(),
          position: pStr.trim(),
          status: sStr.trim().toLowerCase(),
          employmentType: etStr.trim(),
          salary: { 
            basic: parseFloat(r.basic_salary || 0), 
            hra: parseFloat(r.hra || 0), 
            da: parseFloat(r.da || 0) 
          } 
        }
      });
    } else { res.json({ success: false }); }
  } catch (error) { res.status(500).json({ success: false }); }
});

app.put('/api/employees/:id', async (req, res) => {
  try {
    const d = req.body;
    let sets = []; let args = [];
    
    // Explicitly handle salary sub-fields if they exist
    if (d.salary) {
      if (d.salary.basic !== undefined) { sets.push("basic_salary=?"); args.push(d.salary.basic); }
      if (d.salary.hra !== undefined) { sets.push("hra=?"); args.push(d.salary.hra); }
      if (d.salary.da !== undefined) { sets.push("da=?"); args.push(d.salary.da); }
    }

    // Handle other flat fields
    for (const [k, v] of Object.entries(d)) {
      if (k !== 'salary' && k !== 'id' && k !== 'salary_data') { 
        sets.push(`${k}=?`); 
        args.push(v); 
      }
    }
    
    if (sets.length === 0) return res.json({ success: true, message: "No fields to update" });
    
    args.push(req.params.id);
    await pool.query(`UPDATE employees SET ${sets.join(', ')} WHERE id=?`, args);
    res.json({ success: true });
  } catch (error) { 
    console.error("Update Employee Error:", error);
    res.status(500).json({ success: false, error: error.message }); 
  }
});

app.delete('/api/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`[BACKEND] Deleting employee ID: ${id} and all related data...`);

    // 1. Delete associated leave requests
    await pool.query("DELETE FROM leaves_request WHERE employeeId=?", [id]);
    
    // 2. Delete associated attendance records
    await pool.query("DELETE FROM attendance WHERE employeeId=?", [id]);

    // 3. Delete associated payroll records
    await pool.query("DELETE FROM payroll WHERE employeeId=?", [id]);
    
    // 4. Delete the employee record itself
    const [result] = await pool.query("DELETE FROM employees WHERE id=?", [id]);
    
    if (result.affectedRows > 0) {
      console.log(`[BACKEND] Employee ${id} successfully removed.`);
      res.json({ success: true, message: "Employee and all related data deleted successfully" });
    } else {
      res.status(404).json({ success: false, error: "Employee not found" });
    }
  } catch (error) { 
    console.error("[BACKEND] Delete Error:", error);
    res.status(500).json({ success: false, error: error.message }); 
  }
});

// IMAGE UPLOAD API
app.post('/api/employees/:id/upload', upload.single('profilePic'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'No file uploaded' });
    const downloadURL = `http://localhost:5001/uploads/${req.file.filename}`;
    await pool.query("UPDATE employees SET profilePicture = ? WHERE id = ?", [downloadURL, req.params.id]);
    res.json({ success: true, url: downloadURL });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

// ==========================================
// DEPARTMENTS API
// ==========================================
app.get('/api/departments', async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM departments ORDER BY id DESC");
    const mapped = rows.map(r => ({
      id: r.id || r.ID,
      name: (r.name || r.NAME || '').trim(),
      manager: (r.manager || r.MANAGER || 'Unassigned').trim(),
      description: (r.description || r.DESCRIPTION || '').trim(),
      status: (r.status || r.STATUS || 'active').trim().toLowerCase()
    }));
    res.json(mapped);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/departments', async (req, res) => {
  try {
    const d = req.body;
    const [result] = await pool.query("INSERT INTO departments (name, manager, description, status) VALUES (?, ?, ?, ?)", [d.name, d.manager, d.description, d.status || 'active']);
    res.json({ success: true, id: result.insertId });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

app.get('/api/departments/count', async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT COUNT(*) as count FROM departments");
    res.json(rows[0].count);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.delete('/api/departments/:id', async (req, res) => {
  try {
    await pool.query("DELETE FROM departments WHERE id=?", [req.params.id]);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ success: false }); }
});

// ==========================================
// ATTENDANCE API
// ==========================================
app.get('/api/attendance', async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT *, DATE_FORMAT(date, '%Y-%m-%d') as formattedDate FROM attendance ORDER BY date DESC");
    const mapped = rows.map(r => ({ 
      ...r, 
      date: r.formattedDate || r.DATE,
      status: r.status || r.STATUS,
      checkInTime: r.checkInTime || r.CHECKINTIME,
      checkOutTime: r.checkOutTime || r.CHECKOUTTIME,
      workingHours: r.workingHours || r.WORKINGHOURS
    }));
    res.json(mapped);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/attendance/check-in', async (req, res) => {
  try {
    const { employeeId, date } = req.body;
    const [openSession] = await pool.query("SELECT id FROM attendance WHERE employeeId=? AND date=? AND checkOutTime IS NULL", [employeeId, date]);
    if (openSession.length > 0) {
      await pool.query("UPDATE attendance SET checkInTime=NOW() WHERE id=?", [openSession[0].id]);
      return res.json({ success: true, id: openSession[0].id });
    }
    
    const [result] = await pool.query("INSERT INTO attendance (employeeId, date, checkInTime, status) VALUES (?, ?, NOW(), 'present')", [employeeId, date]);
    res.json({ success: true, id: result.insertId });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

app.post('/api/attendance/check-out', async (req, res) => {
  try {
    const { employeeId, date } = req.body;
    const [openSession] = await pool.query("SELECT id, checkInTime FROM attendance WHERE employeeId=? AND date=? AND checkOutTime IS NULL ORDER BY checkInTime DESC LIMIT 1", [employeeId, date]);
    
    if (openSession.length > 0) {
      await pool.query("UPDATE attendance SET checkOutTime=NOW(), status='checked-out', workingHours=TIMESTAMPDIFF(MINUTE, checkInTime, NOW())/60 WHERE id=?", [openSession[0].id]);
      return res.json({ success: true });
    }
    
    const [result] = await pool.query("INSERT INTO attendance (employeeId, date, checkOutTime, status) VALUES (?, ?, NOW(), 'checked-out')", [employeeId, date]);
    res.json({ success: true, id: result.insertId });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

app.get('/api/attendance/record/:empId/:date', async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT *, DATE_FORMAT(date, '%Y-%m-%d') as formattedDate FROM attendance WHERE employeeId=? AND date=?", [req.params.empId, req.params.date]);
    if (rows.length > 0) {
      rows[0].date = rows[0].formattedDate;
      res.json({ success: true, data: rows[0] });
    } else res.json({ success: false, error: "Not found" });
  } catch (error) { res.status(500).json({ success: false }); }
});

app.get('/api/attendance/present-today/:date', async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT COUNT(DISTINCT employeeId) as count FROM attendance WHERE date=? AND (status='present' OR status='checked-out')", [req.params.date]);
    res.json(rows[0].count);
  } catch (error) { res.status(500).json(0); }
});

// ==========================================
// LEAVES API
// ==========================================
app.get('/api/leaves/employee/:id', async (req, res) => {
  try {
    let employeeId = req.params.id;
    // Map UID if needed
    if (isNaN(employeeId)) {
      const [u] = await pool.query("SELECT email FROM users WHERE uid = ?", [employeeId]);
      if (u.length > 0) {
        const [emp] = await pool.query("SELECT id FROM employees WHERE email = ?", [u[0].email]);
        if (emp.length > 0) employeeId = emp[0].id;
      }
    }
    const [rows] = await pool.query(`
      SELECT lr.*, 
             COALESCE(e.firstName, lr.employeeName) as firstName, 
             COALESCE(e.department, lr.department) as department, 
             COALESCE(e.position, lr.position) as position,
             lr.STATUS as status 
      FROM leaves_request lr 
      LEFT JOIN employees e ON lr.employeeId = e.id 
      WHERE lr.employeeId = ? 
      ORDER BY lr.id DESC
    `, [employeeId]);
    res.json(rows);
  } catch (error) { res.status(500).json([]); }
});

app.get('/api/leaves', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT lr.*, 
             COALESCE(e.firstName, lr.employeeName) as firstName, 
             COALESCE(e.lastName, '') as lastName, 
             COALESCE(e.department, lr.department) as department, 
             COALESCE(e.position, lr.position) as position,
             lr.STATUS as status 
      FROM leaves_request lr 
      LEFT JOIN employees e ON lr.employeeId = e.id 
      ORDER BY lr.id DESC
    `);
    res.json(rows);
  } catch (error) { res.status(500).json([]); }
});

app.post('/api/leaves', async (req, res) => {
  try {
    const d = req.body;
    let employeeId = d.employeeId;
    const email = d.email;

    // 1. If we have an email, try to find employeeId directly in employees table
    if (email) {
      const [emp] = await pool.query("SELECT id FROM employees WHERE email = ?", [email]);
      if (emp.length > 0) {
        employeeId = emp[0].id;
      }
    } 
    
    // 2. Fallback: If employeeId is a Firebase UID (string), try mapping via users table
    if (typeof employeeId === 'string' && isNaN(employeeId)) {
      const [u] = await pool.query("SELECT email FROM users WHERE uid = ?", [employeeId]);
      if (u.length > 0) {
        const [emp] = await pool.query("SELECT id FROM employees WHERE email = ?", [u[0].email]);
        if (emp.length > 0) employeeId = emp[0].id;
      }
    }

    if (!employeeId || isNaN(employeeId)) {
      console.error("[LEAVE_ERROR] No employee record found for email:", email, "and UID:", d.employeeId);
      return res.status(400).json({ 
        success: false, 
        error: `Could not link request to an employee profile for ${email}. Please ensure you have created an Employee Profile in the 'Employees' section before applying for leave.` 
      });
    }

    const [result] = await pool.query(
      "INSERT INTO leaves_request (employeeId, leaveType, startDate, endDate, reason, STATUS, employeeName, department, position) VALUES (?, ?, ?, ?, ?, 'pending', ?, ?, ?)", 
      [employeeId, d.leaveType, d.startDate, d.endDate, d.reason, d.employeeName || d.name, d.department, d.position]
    );
    res.json({ success: true, id: result.insertId });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

app.get('/api/leaves/pending', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT lr.*, 
             COALESCE(e.firstName, lr.employeeName) as firstName, 
             COALESCE(e.lastName, '') as lastName, 
             COALESCE(e.department, lr.department) as department, 
             COALESCE(e.position, lr.position) as position,
             lr.STATUS as status 
      FROM leaves_request lr 
      LEFT JOIN employees e ON lr.employeeId = e.id 
      WHERE lr.STATUS = 'pending'
    `);
    res.json(rows);
  } catch (error) { res.status(500).json([]); }
});

app.get('/api/leaves/pending-count', async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT COUNT(*) as count FROM leaves_request WHERE STATUS='pending'");
    res.json(rows[0].count);
  } catch (error) { res.status(500).json(0); }
});

app.put('/api/leaves/approve/:id', async (req, res) => {
  try {
    await pool.query("UPDATE leaves_request SET STATUS='approved' WHERE id=?", [req.params.id]);
    res.json({ success: true });
    // Trigger automated email
    sendLeaveEmail(req.params.id, 'approved');
  } catch (error) { res.status(500).json({ success: false }); }
});

app.put('/api/leaves/reject/:id', async (req, res) => {
  try {
    const { reason } = req.body;
    await pool.query("UPDATE leaves_request SET STATUS='rejected', rejection_reason=? WHERE id=?", [reason, req.params.id]);
    res.json({ success: true });
    sendLeaveEmail(req.params.id, 'rejected', reason);
  } catch (error) { res.status(500).json({ success: false }); }
});

app.put('/api/leaves/cancel/:id', async (req, res) => {
  try {
    const { reason } = req.body;
    await pool.query("UPDATE leaves_request SET STATUS='cancelled', cancellation_reason=? WHERE id=?", [reason, req.params.id]);
    res.json({ success: true });
    sendLeaveEmail(req.params.id, 'cancelled', reason);
  } catch (error) { res.status(500).json({ success: false }); }
});

app.delete('/api/leaves', async (req, res) => {
  try {
    await pool.query("DELETE FROM leaves_request");
    res.json({ success: true, message: "Leave history cleared" });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

// ==========================================
// PAYROLL API
// ==========================================
app.get('/api/payroll/total/:month', async (req, res) => {
  try {
    const { month } = req.params;
    const [rows] = await pool.query(`
      SELECT 
        COUNT(*) as employeeCount,
        SUM(basic_salary) as totalBasicSalary,
        SUM(hra + da) as totalAllowances,
        SUM(pf + tax) as totalDeductions,
        SUM(net_salary) as totalNetSalary
      FROM payroll 
      WHERE month = ?
    `, [month]);

    const data = rows[0];
    res.json({ 
      success: true, 
      data: {
        employeeCount: data.employeeCount || 0,
        totalBasicSalary: parseFloat(data.totalBasicSalary || 0),
        totalAllowances: parseFloat(data.totalAllowances || 0),
        totalDeductions: parseFloat(data.totalDeductions || 0),
        totalNetSalary: parseFloat(data.totalNetSalary || 0),
        month
      } 
    });
  } catch (error) { 
    console.error("Error fetching payroll total:", error);
    res.status(500).json({ success: false, error: error.message }); 
  }
});

app.post('/api/payroll/process', async (req, res) => {
  try {
    const { month } = req.body;
    if (!month) return res.status(400).json({ success: false, error: 'Month is required' });

    const [employees] = await pool.query("SELECT * FROM employees WHERE status='active'");

    for (const emp of employees) {
      if (!emp.email) continue;

      const basic = parseFloat(emp.basic_salary || 0);
      const hra = parseFloat(emp.hra || 0);
      const da = parseFloat(emp.da || 0);
      const gross = basic + hra + da;
      
      // PF: 12% of basic, Tax: 5% of gross
      const pf = basic * 0.12;
      const tax = gross * 0.05;
      const net = gross - pf - tax;

      // Upsert record into payroll table
      await pool.query(`
        INSERT INTO payroll 
          (employeeId, month, basic_salary, hra, da, gross_salary, pf, tax, net_salary)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
          basic_salary = VALUES(basic_salary),
          hra = VALUES(hra),
          da = VALUES(da),
          gross_salary = VALUES(gross_salary),
          pf = VALUES(pf),
          tax = VALUES(tax),
          net_salary = VALUES(net_salary),
          processedAt = NOW()
      `, [emp.id, month, basic, hra, da, gross, pf, tax, net]);

      // Trigger email (no await to avoid blocking)
      sendPayrollEmail(emp, month, { basic, hra, da, net }).catch(err => {
        console.error(`[EMAIL_SERVICE] Failed to send email for employee ${emp.id}:`, err);
      });

      // Trigger SMS Notification (no await)
      if (emp.phone) {
        // Ultra-safe message (no special characters) for maximum delivery chance
        const cleanAmount = net.toFixed(0);
        const smsMessage = `HRNEXUS Hello ${emp.firstName} Payroll ${month} ready Amount INR ${cleanAmount}`;
        sendSMS(emp.phone, smsMessage).catch(err => {
          console.error(`[SMS_SERVICE] Failed to send SMS to ${emp.phone}:`, err);
        });
      }
    }

    res.json({ success: true, message: `Payroll processed and recorded for ${employees.length} active employees.` });
  } catch (error) {
    console.error("Error processing payroll:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/payroll/payslip/:uid/:month', async (req, res) => {
  try {
    const { uid, month } = req.params;
    const { email: queryEmail } = req.query;
    
    let targetEmail = queryEmail;
    
    if (!targetEmail) {
      // 1. Find employee by email associated with UID
      const [users] = await pool.query("SELECT email FROM users WHERE uid = ?", [uid]);
      if (users.length === 0) {
        // Fallback: If UID not in Users table, it might be a fresh login or admin.
        // We'll return 404 but suggest using email param if Admin is calling.
        return res.status(404).json({ success: false, error: 'User not found. Admin: please select an employee.' });
      }
      targetEmail = users[0].email;
    }
    
    // 2. Find employee profiling
    const [employees] = await pool.query("SELECT * FROM employees WHERE email = ?", [targetEmail]);
    if (employees.length === 0) return res.status(404).json({ success: false, error: `Employee profile not found for ${targetEmail}` });
    
    const emp = employees[0];
    const basic = parseFloat(emp.basic_salary || 0);
    const hra = parseFloat(emp.hra || 0);
    const da = parseFloat(emp.da || 0);
    const gross = basic + hra + da;
    
    // PF is usually 12% of basic, Tax is 5% of gross for this dummy
    const pf = basic * 0.12;
    const tax = gross * 0.05;
    const net = gross - pf - tax;

    // Stable Generation ID based on email and month
    const crypto = require('crypto');
    const stableIdSuffix = crypto.createHash('md5').update(targetEmail + month).digest('hex').substring(0, 6).toUpperCase();
    const generationId = `HRN-${month.replace('-', '')}-${emp.id}-${stableIdSuffix}`;

    res.json({
      success: true,
      data: {
        company: {
          name: "HR-NEXUS ENTERPRISE",
          address: "123 Business Hub, Tech Park, Bangalore, India - 560001",
          registration: "CIN: U72200KA2026PTC123456"
        },
        employee: {
          id: `EMP-${String(emp.id).padStart(4, '0')}`,
          firstName: emp.firstName,
          lastName: emp.lastName,
          email: emp.email,
          department: emp.department || "General",
          bank: {
            bankName: "HDFC Bank Ltd.",
            accountNumber: `XXXXXX${String(emp.id * 7).substring(0,4)}`,
            ifsc: "HDFC0001234"
          },
          employment: {
            position: emp.position || "Staff Associate",
            joinDate: emp.joinDate ? new Date(emp.joinDate).toLocaleDateString() : 'Active Member',
            type: emp.employmentType || 'Full-time'
          }
        },
        payroll: {
          month,
          basicSalary: basic,
          allowances: { hra, dearness: da, specialAllowance: 0 },
          grossSalary: gross,
          deductions: { pf, tax, insurance: 0 },
          totalDeductions: pf + tax,
          netSalary: net,
          generationId
        },
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = 5001;
app.listen(PORT, () => console.log(`Backend server running on http://localhost:${PORT}`));
