const axios = require('axios');

async function loginUser() {
  const email = 'djkeimz@gmail.com';
  const password = '@@hakim##';
  const apiKey = 'AIzaSyAUTRFwmPf47uFKAGLJRX_txa-tsxTubG8';
  
  try {
    console.log('1. Logging in with Firebase Auth...');
    const fbRes = await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, {
      email,
      password,
      returnSecureToken: true
    });
    
    const firebaseUid = fbRes.data.localId;
    console.log(`Firebase login successful! UID: ${firebaseUid}`);
    
    console.log('2. Logging in to backend API...');
    
    // First, try the main Render URL
    let apiUrl = 'https://jazz-api.onrender.com/auth/login';
    try {
      const apiRes = await axios.post(apiUrl, {
        firebaseUid
      });
      console.log('Backend login successful! You are fully registered.', Object.keys(apiRes.data));
    } catch (err) {
      console.error(`Failed to login at ${apiUrl}. Error: ${err.message}`);
      if (err.response) {
        console.error(err.response.data);
      }
      
      // If the user doesn't exist on the backend but exists on Firebase, let's register them on the backend
      console.log('Attempting to register user on the backend API since login failed...');
      apiUrl = 'https://jazz-api.onrender.com/auth/register';
      try {
        const regRes = await axios.post(apiUrl, {
          email,
          password,
          name: 'Hakim',
          phone: '',
          firebaseUid
        });
        console.log('Backend registration successful!', Object.keys(regRes.data));
      } catch(regErr) {
        console.error('Backend registration also failed', regErr.message);
      }
    }
  } catch (error) {
    console.error('Login process failed.');
    if (error.response) {
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

loginUser();
