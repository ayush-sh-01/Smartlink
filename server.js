/**
 * SmartLink Business - Node.js Express & Nodemailer Server Alternative
 */
const express = require('express');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const leadsFile = path.join(__dirname, 'enquiries.json');

app.use(express.json());
app.use(express.static(__dirname));

// Ensure enquiries.json exists
if (!fs.existsSync(leadsFile)) {
  fs.writeFileSync(leadsFile, '[]', 'utf8');
}

app.post('/api/send-enquiry', async (req, res) => {
  const { fullName, businessName, email, phone, service, message, timestamp } = req.body;

  if (!fullName || !email) {
    return res.status(400).json({ success: false, message: 'Missing required name or email fields.' });
  }

  // Persist locally
  try {
    const raw = fs.existsSync(leadsFile) ? fs.readFileSync(leadsFile, 'utf8').replace(/^\uFEFF/, '') : '[]';
    const existing = JSON.parse(raw || '[]');
    existing.push({
      id: 'LEAD-' + Date.now(),
      fullName,
      businessName,
      email,
      phone,
      service,
      message,
      timestamp: timestamp || new Date().toISOString()
    });
    fs.writeFileSync(leadsFile, JSON.stringify(existing, null, 2), 'utf8');
  } catch (err) {
    console.error('File logging error:', err);
  }

  const notificationEmail = process.env.NOTIFICATION_EMAIL;
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT || 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (smtpHost && smtpUser && smtpPass && notificationEmail) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(smtpPort, 10),
        secure: parseInt(smtpPort, 10) === 465,
        auth: { user: smtpUser, pass: smtpPass }
      });

      await transporter.sendMail({
        from: process.env.FROM_EMAIL || smtpUser,
        to: notificationEmail,
        subject: `New SmartLink Enquiry: ${fullName} - ${businessName} (${service})`,
        html: `
          <h2>New Customer Lead Received</h2>
          <p><strong>Customer Name:</strong> ${fullName}</p>
          <p><strong>Business / Venue:</strong> ${businessName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Service Requested:</strong> ${service}</p>
          <p><strong>Message / Notes:</strong> ${message || 'None'}</p>
          <p><strong>Date:</strong> ${timestamp || new Date().toISOString()}</p>
        `
      });

      return res.json({ success: true, message: `Enquiry emailed to ${notificationEmail}` });
    } catch (error) {
      console.error('SMTP Error:', error);
      return res.json({ success: false, code: 'SMTP_ERROR', message: error.message });
    }
  } else {
    return res.json({
      success: false,
      code: 'SMTP_NOT_CONFIGURED',
      message: 'Enquiry stored on server! Configure NOTIFICATION_EMAIL and SMTP credentials in .env for email delivery.'
    });
  }
});

app.listen(PORT, () => {
  console.log(`SmartLink Business Server running at http://localhost:${PORT}`);
});
