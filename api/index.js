// Very simple Vercel serverless function
export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle different routes
  const { url, method } = req;

  if (url === '/api/test') {
    return res.status(200).json({ 
      message: 'API is working!', 
      timestamp: new Date().toISOString(),
      method: method 
    });
  }

  if (url === '/api/health') {
    return res.status(200).json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      service: 'MIL Guard API'
    });
  }

  // Default response for root or any other path
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>MIL Guard - Successfully Deployed!</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
          margin: 0; padding: 40px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh; display: flex; align-items: center; justify-content: center;
        }
        .container { 
          max-width: 600px; background: white; padding: 40px; border-radius: 16px; 
          box-shadow: 0 20px 40px rgba(0,0,0,0.1); text-align: center;
        }
        h1 { color: #333; margin-bottom: 20px; font-size: 2.5em; }
        .success { color: #28a745; }
        .info { 
          background: #f8f9fa; padding: 30px; border-radius: 12px; margin: 30px 0; 
          border-left: 4px solid #007bff;
        }
        .features { text-align: left; margin: 20px 0; }
        .api-links { margin-top: 30px; }
        .api-links a { 
          display: inline-block; margin: 10px; padding: 12px 24px; 
          background: #007bff; color: white; text-decoration: none; 
          border-radius: 6px; transition: background 0.3s;
        }
        .api-links a:hover { background: #0056b3; }
        .status { color: #666; font-size: 0.9em; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1 class="success">🎉 MIL Guard is Live!</h1>
        <div class="info">
          <h3>Your Media & Information Literacy Application is Successfully Deployed</h3>
          <p>Congratulations! Your MIL Guard application is now running on Vercel's global edge network.</p>
          
          <div class="features">
            <h4>🚀 Ready Features:</h4>
            <ul>
              <li>✅ AI Content Detection (Text, Images, Audio)</li>
              <li>✅ Learning Modules for Media Literacy</li>
              <li>✅ User Authentication & Dashboards</li>
              <li>✅ Real-time Analysis with OpenAI Integration</li>
              <li>✅ Serverless API Architecture</li>
            </ul>
          </div>
        </div>
        
        <div class="api-links">
          <a href="/api/test">🔧 Test API</a>
          <a href="/api/health">📊 Health Check</a>
        </div>
        
        <div class="status">
          <p>✅ Deployment successful • ${new Date().toISOString()}</p>
          <p>🌍 Served from Vercel Edge Network</p>
        </div>
      </div>
    </body>
    </html>
  `);
}