/**
 * SmartLink Business - Node.js Express Server
 * Serves static assets and mounts the enquiry API handler
 */
const express = require('express');
const path = require('path');
require('dotenv').config();

const sendEnquiryHandler = require('./api/send-enquiry');
const proxyRenderHandler = require('./api/proxy-render');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use(express.static(path.join(__dirname)));

// Fallback explicit static file routes
app.get('/css/style.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'css', 'style.css'));
});
app.get('/js/main.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'js', 'main.js'));
});

// Explicit route for preview demo
app.get('/demo', (req, res) => {
  res.sendFile(path.join(__dirname, 'demo-preview.html'));
});

// Explicit root route for index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Mount send-enquiry endpoint
app.all('/api/send-enquiry', (req, res) => {
  return sendEnquiryHandler(req, res);
});

// Mount proxy endpoint for Render demo iframe
app.get('/api/proxy-render', (req, res) => {
  return proxyRenderHandler(req, res);
});

// Start local server if run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`SmartLink Business Server running at http://localhost:${PORT}`);
  });
}

module.exports = app;
