/**
 * Vercel Serverless Function & Express Route Handler
 * Handles customer lead enquiries and sends email notifications via Nodemailer
 */
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Ensure dotenv is loaded if running locally
try {
  require('dotenv').config();
} catch (e) {}

module.exports = async (req, res) => {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  // Handle body parsing if invoked as a serverless function
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      body = {};
    }
  }

  const { fullName, businessName, email, phone, service, message, timestamp } = body || {};

  if (!fullName || !email) {
    return res.status(400).json({
      success: false,
      message: 'Missing required name or email fields.'
    });
  }

  // Persist locally (/tmp on Vercel, enquiries.json in project root on local)
  try {
    const isVercel = Boolean(process.env.VERCEL);
    const leadsFile = isVercel
      ? path.join('/tmp', 'enquiries.json')
      : path.join(__dirname, '..', 'enquiries.json');

    const raw = fs.existsSync(leadsFile)
      ? fs.readFileSync(leadsFile, 'utf8').replace(/^\uFEFF/, '')
      : '[]';
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
    console.warn('Local log warning (ignored in serverless):', err.message);
  }

  // Read SMTP settings
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
        subject: `New SmartLink Enquiry: ${fullName} - ${businessName || 'General'} (${service || 'General'})`,
        html: `
          <h2>New Customer Lead Received</h2>
          <p><strong>Customer Name:</strong> ${fullName}</p>
          <p><strong>Business / Venue:</strong> ${businessName || 'Not specified'}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'Not specified'}</p>
          <p><strong>Service Requested:</strong> ${service || 'General'}</p>
          <p><strong>Message / Notes:</strong> ${message || 'None'}</p>
          <p><strong>Date:</strong> ${timestamp || new Date().toISOString()}</p>
        `
      });

      return res.status(200).json({
        success: true,
        message: `Enquiry emailed to ${notificationEmail}`
      });
    } catch (error) {
      console.error('SMTP Error:', error);
      return res.status(200).json({
        success: false,
        code: 'SMTP_ERROR',
        message: error.message
      });
    }
  } else {
    return res.status(200).json({
      success: true,
      code: 'SAVED_NO_SMTP',
      message: 'Enquiry received! (Configure SMTP credentials in Vercel Environment Variables for instant email alerts).'
    });
  }
};
