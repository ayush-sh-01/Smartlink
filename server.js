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
app.use(express.static(__dirname));

// Mount send-enquiry endpoint
app.all('/api/send-enquiry', (req, res) => {
  return sendEnquiryHandler(req, res);
});

// Mount proxy endpoint for Render demo iframe
app.get('/api/proxy-render', (req, res) => {
  return proxyRenderHandler(req, res);
});

// Explicit root route for index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start local server if run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`SmartLink Business Server running at http://localhost:${PORT}`);
  });
}

module.exports = app;
