// Health check script for Docker containers
import http from 'http';

const options = {
  hostname: 'localhost',
  port: process.env.PORT || 3000,
  path: '/api/health',
  timeout: 5000
};

const req = http.request(options, (res) => {
  if (res.statusCode === 200) {
    console.log('Health check passed');
    process.exit(0);
  } else {
    console.log(`Health check failed: ${res.statusCode}`);
    process.exit(1);
  }
});

req.on('error', (error) => {
  console.log(`Health check error: ${error.message}`);
  process.exit(1);
});

req.end();