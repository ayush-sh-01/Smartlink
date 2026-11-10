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

  const { fullName, businessName, city, tablesCount, email, phone, service, message, timestamp } = body || {};

  if (!fullName || (!email && !phone)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide your name and at least a phone number or email.'
    });
  }

  const cleanPhone = (phone || '').replace(/[^0-9+]/g, '');
  const cleanEmail = email && email.includes('@') && !email.includes('@client.smartlink') ? email : 'Not Provided';
  const whatsappUrl = cleanPhone ? `https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone.replace(/^0+/, '')}` : '#';
  const callUrl = cleanPhone ? `tel:${cleanPhone}` : '#';

  // Format nice Indian Standard Time
  const dateFormatted = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short'
  });

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
      businessName: businessName || 'Not specified',
      city: city || 'Not specified',
      tablesCount: tablesCount || 'Not specified',
      email: cleanEmail,
      phone: phone || 'Not specified',
      service: service || 'General',
      message: message || 'None',
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
        from: `SmartLink Leads <${process.env.FROM_EMAIL || smtpUser}>`,
        to: notificationEmail,
        subject: `⚡ New Lead: ${fullName} - ${businessName || 'Business'} (${city || 'India'})`,
        html: `
          <!DOCTYPE html>
          <html>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f1115; color: #ffffff; padding: 24px; margin: 0;">
            <div style="max-width: 580px; margin: 0 auto; background: #181b22; border-radius: 14px; border: 1px solid #2d3340; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
              
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 22px 28px;">
                <div style="font-size: 11px; font-weight: 800; letter-spacing: 2px; color: #000; text-transform: uppercase;">SmartLink Business Notification</div>
                <h1 style="margin: 4px 0 0; color: #000; font-size: 22px; font-weight: 800;">⚡ New Customer Enquiry Received</h1>
              </div>

              <!-- Body -->
              <div style="padding: 28px;">

                <!-- Action Buttons: WhatsApp & Call -->
                <div style="display: flex; gap: 12px; margin-bottom: 24px;">
                  <a href="${whatsappUrl}" style="background: #25D366; color: #000; text-decoration: none; padding: 12px 20px; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">
                    💬 Chat on WhatsApp
                  </a>
                  <a href="${callUrl}" style="background: #3b82f6; color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block; margin-left: 10px;">
                    📞 Call Client
                  </a>
                </div>

                <!-- Info Table -->
                <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                  <tr>
                    <td style="padding: 10px 0; color: #9ca3af; border-bottom: 1px solid #2d3340; width: 150px;">👤 Client Name</td>
                    <td style="padding: 10px 0; color: #ffffff; font-weight: bold; border-bottom: 1px solid #2d3340;">${fullName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #9ca3af; border-bottom: 1px solid #2d3340;">🏢 Business Name</td>
                    <td style="padding: 10px 0; color: #ffffff; font-weight: bold; border-bottom: 1px solid #2d3340;">${businessName || 'Not specified'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #9ca3af; border-bottom: 1px solid #2d3340;">📍 City / Location</td>
                    <td style="padding: 10px 0; color: #f59e0b; font-weight: bold; border-bottom: 1px solid #2d3340;">${city || 'Not specified'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #9ca3af; border-bottom: 1px solid #2d3340;">🪑 Tables / Outlets</td>
                    <td style="padding: 10px 0; color: #34d399; font-weight: bold; border-bottom: 1px solid #2d3340;">${tablesCount || 'Not specified'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #9ca3af; border-bottom: 1px solid #2d3340;">⚡ Solution Interested</td>
                    <td style="padding: 10px 0; color: #ffffff; font-weight: bold; border-bottom: 1px solid #2d3340;">${service || 'General Enquiry'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #9ca3af; border-bottom: 1px solid #2d3340;">📞 Phone Number</td>
                    <td style="padding: 10px 0; color: #60a5fa; font-weight: bold; border-bottom: 1px solid #2d3340;">${phone || 'Not specified'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #9ca3af; border-bottom: 1px solid #2d3340;">✉️ Email Address</td>
                    <td style="padding: 10px 0; color: #ffffff; border-bottom: 1px solid #2d3340;">${cleanEmail}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #9ca3af; border-bottom: 1px solid #2d3340;">⏰ Date & Time</td>
                    <td style="padding: 10px 0; color: #9ca3af; border-bottom: 1px solid #2d3340;">${dateFormatted} (IST)</td>
                  </tr>
                </table>

                <!-- Message Box -->
                <div style="margin-top: 20px; background: #12141a; padding: 16px; border-radius: 8px; border-left: 4px solid #f59e0b;">
                  <div style="font-size: 11px; text-transform: uppercase; color: #f59e0b; font-weight: bold; margin-bottom: 6px;">Client Message / Requirement:</div>
                  <div style="color: #e5e7eb; font-size: 14px; line-height: 1.5; white-space: pre-wrap;">${message || 'No additional message provided.'}</div>
                </div>

              </div>

              <!-- Footer -->
              <div style="background: #12141a; padding: 14px 28px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #2d3340;">
                SmartLink Business Lead Delivery System &bull; <a href="https://smartlink7697@gmail.com" style="color: #f59e0b; text-decoration: none;">smartlink7697@gmail.com</a>
              </div>

            </div>
          </body>
          </html>
        `
      });

      return res.status(200).json({
        success: true,
        message: `Enquiry emailed to ${notificationEmail}`
      });
    } catch (error) {
      console.warn('SMTP Notification Warning (Lead is safely saved):', error.message);
      return res.status(200).json({
        success: true,
        savedLocally: true,
        message: 'Thank you! Your enquiry has been received. Our team will contact you shortly.'
      });
    }
  } else {
    return res.status(200).json({
      success: true,
      code: 'SAVED_NO_SMTP',
      message: 'Thank you! Your enquiry has been received. Our team will contact you shortly.'
    });
  }
};
