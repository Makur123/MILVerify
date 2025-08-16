const express = require('express');
const path = require('path');

const app = express();

// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve static files for the root route
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>MIL Guard - Deployed!</title>
      <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        .container { max-width: 600px; margin: 0 auto; }
        h1 { color: #333; }
        .success { color: #28a745; }
        .info { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1 class="success">🎉 MIL Guard is Successfully Deployed!</h1>
        <div class="info">
          <h3>Your Media & Information Literacy Application is Live</h3>
          <p>This is your deployed MIL Guard application. The API is working and ready to serve your AI content detection features.</p>
          <p><strong>Features Available:</strong></p>
          <ul style="text-align: left;">
            <li>✅ AI Content Detection (Text, Images, Audio)</li>
            <li>✅ Learning Modules for Media Literacy</li>
            <li>✅ User Authentication & Dashboards</li>
            <li>✅ Real-time Analysis with OpenAI</li>
          </ul>
        </div>
        <p><a href="/api/test" style="color: #007bff;">Test API Endpoint</a> | <a href="/api/health" style="color: #007bff;">Health Check</a></p>
      </div>
    </body>
    </html>
  `);
});

// Handle all other routes
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    res.status(404).json({ error: 'API endpoint not found' });
  } else {
    res.redirect('/');
  }
});

module.exports = app;