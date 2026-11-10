/**
 * Proxy Endpoint for Multi-Vendor Platform on Render
 * Strips X-Frame-Options header and injects <base href="...">
 * so it can be previewed seamlessly inside an iframe.
 */

const https = require('https');

module.exports = async (req, res) => {
  const targetUrl = 'https://multivendor-platform-2vkb.onrender.com';

  try {
    const fetchResponse = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!fetchResponse.ok) {
      return res.status(fetchResponse.status).send('Unable to load preview');
    }

    let html = await fetchResponse.text();

    // Inject <base href> right after <head> so all scripts/styles/images resolve to Render
    const baseTag = `<base href="https://multivendor-platform-2vkb.onrender.com/">`;
    if (html.includes('<head>')) {
      html = html.replace('<head>', `<head>\n    ${baseTag}`);
    } else {
      html = `${baseTag}\n${html}`;
    }

    // Set headers permitting iframe embedding
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.removeHeader('X-Frame-Options');
    res.removeHeader('Content-Security-Policy');

    return res.status(200).send(html);
  } catch (error) {
    console.error('Render Proxy Error:', error);
    return res.status(502).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { margin:0; background:#121212; color:#fff; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; font-family:sans-serif; text-align:center; padding:20px; }
          a { background:#f59e0b; color:#000; padding:10px 20px; border-radius:99px; text-decoration:none; font-weight:bold; margin-top:14px; }
        </style>
      </head>
      <body>
        <h3>Multi-Vendor Platform (Waking up...)</h3>
        <p style="color:#aaa; font-size:14px;">Render free server may take a few moments to spin up.</p>
        <a href="${targetUrl}" target="_blank">Open Direct Website ↗</a>
      </body>
      </html>
    `);
  }
};

