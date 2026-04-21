// Full login flow test
const axios = require('axios');

const email = 'hakimhakvin@gmail.com';
const password = '@@Hakim123';
const apiUrl = 'http://localhost:5000';

async function fullLoginTest() {
  console.log('\n=== FULL LOGIN FLOW TEST ===\n');
  
  // Step 1: Try to login
  console.log('Step 1: Attempting login...');
  try {
    const response = await axios.post(`${apiUrl}/auth/login`, {
      email,
      password
    });
    
    console.log('✓ Login successful');
    const { accessToken, refreshToken } = response.data;
    
    console.log('  - Access Token length:', accessToken.length);
    console.log('  - Refresh Token length:', refreshToken.length);
    console.log('  - Access Token preview:', accessToken.substring(0, 50) + '...');
    
    // Step 2: Try to use the token to fetch user
    console.log('\nStep 2: Testing token by fetching /users/me...');
    try {
      const meResponse = await axios.get(`${apiUrl}/users/me`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      console.log('✓ Successfully fetched user with token');
      console.log('  User data:', {
        id: meResponse.data.id,
        email: meResponse.data.email,
        name: meResponse.data.name
      });
    } catch (err) {
      console.error('✗ Failed to fetch user with token');
      if (err.response) {
        console.error('  Status:', err.response.status);
        console.error('  Data:', err.response.data);
      } else {
        console.error('  Error:', err.message);
      }
    }
    
    // Step 3: Test refresh token
    console.log('\nStep 3: Testing refresh token...');
    try {
      const refreshResponse = await axios.post(`${apiUrl}/auth/refresh`, {
        refreshToken
      });
      console.log('✓ Refresh token works');
      console.log('  - New Access Token length:', refreshResponse.data.accessToken.length);
    } catch (err) {
      console.error('✗ Refresh token failed');
      if (err.response) {
        console.error('  Status:', err.response.status);
        console.error('  Data:', err.response.data);
      } else {
        console.error('  Error:', err.message);
      }
    }
    
  } catch (error) {
    console.error('✗ Login failed');
    if (error.response) {
      console.error('  Status:', error.response.status);
      console.error('  Data:', error.response.data);
    } else {
      console.error('  Error:', error.message);
    }
  }
  
  console.log('\n=== TEST COMPLETE ===\n');
}

fullLoginTest();
