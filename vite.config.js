import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import https from 'node:https'

function contactApiPlugin() {
  return {
    name: 'contact-api-plugin',
    configureServer(server) {
      server.middlewares.use('/api/contact', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });

        req.on('end', () => {
          try {
            const data = JSON.parse(body || '{}');
            const targetEmail = data.to_email || 'bharathi3102a@gmail.com';

            const postData = new URLSearchParams({
              name: data.name || '',
              email: data.email || '',
              phone: data.phone || 'Not provided',
              subject: data.subject || 'New Portfolio Contact Message',
              message: data.message || '',
              _replyto: data.email || '',
              _subject: data.subject || `New Portfolio Message – ${data.name || 'Visitor'}`,
              _template: 'table',
              _captcha: 'false',
              _autoresponse:
                data._autoresponse ||
                `Hi ${data.name || 'there'},\n\nThank you for reaching out through my portfolio website! I have received your message and will get back to you as soon as possible.\n\nBest regards,\nBharathi.O\nData Analyst | Bangalore, India\nEmail: bharathi3102a@gmail.com`,
            }).toString();

            const options = {
              hostname: 'formsubmit.co',
              port: 443,
              path: `/${encodeURIComponent(targetEmail)}`,
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData),
                'User-Agent':
                  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              },
            };

            const forwardReq = https.request(options, (forwardRes) => {
              let respBody = '';
              forwardRes.on('data', (chunk) => {
                respBody += chunk;
              });
              forwardRes.on('end', () => {
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 200;
                res.end(
                  JSON.stringify({
                    success: true,
                    message: 'Message delivered successfully to your Gmail inbox!',
                  })
                );
              });
            });

            forwardReq.on('error', (err) => {
              console.error('Contact forwarding error:', err);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 500;
              res.end(
                JSON.stringify({
                  success: false,
                  error: err.message,
                })
              );
            });

            forwardReq.write(postData);
            forwardReq.end();
          } catch (err) {
            console.error('Request parsing error:', err);
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Invalid JSON request payload' }));
          }
        });
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    contactApiPlugin(),
  ],
})
