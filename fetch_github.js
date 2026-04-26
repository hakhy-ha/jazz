const https = require('https');

https.get('https://api.github.com/repos/hakhy-ha/jazz/commits/main/status', {
  headers: { 'User-Agent': 'Node.js' }
}, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => console.log(data));
}).on('error', (err) => console.log('Error: ', err.message));
