const http = require('http');
const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/services/apexrest/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
};
const req = http.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`);
  res.on('data', d => {
    process.stdout.write(d);
  });
});
req.on('error', error => {
  console.error(error);
});
req.write('username=test&password=test');
req.end();
