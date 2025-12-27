const http = require('http');

const options = {
  hostname: 'localhost',
  port: process.env.PORT || 5000,
  path: '/api/health',
  method: 'GET',
  timeout: 5000
};

console.log(`Testing health check at http://${options.hostname}:${options.port}${options.path}`);

const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log(`Status Message: ${res.statusMessage}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', data);
    if (res.statusCode === 200) {
      console.log('✅ Health check PASSED!');
      process.exit(0);
    } else {
      console.log('❌ Health check FAILED!');
      process.exit(1);
    }
  });
});

req.on('error', (err) => {
  console.error('❌ Health check ERROR:', err.message);
  process.exit(1);
});

req.on('timeout', () => {
  console.error('❌ Health check TIMEOUT');
  req.destroy();
  process.exit(1);
});

req.end();