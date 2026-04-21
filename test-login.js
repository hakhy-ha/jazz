// Simple test script to verify login flow
const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testing login endpoint...');
    const response = await axios.post('http://localhost:5000/auth/login', {
      email: 'hakimhakvin@gmail.com',
      password: '@@Hakim123'
    });
    console.log('✓ Login successful');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    console.log('Access token exists:', !!response.data.accessToken);
    console.log('Refresh token exists:', !!response.data.refreshToken);
  } catch (error) {
    console.error('✗ Login failed');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testLogin();
