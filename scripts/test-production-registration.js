const fetch = require('node-fetch');

async function testProductionRegistration() {
  console.log('🧪 Testing production registration at https://blogspace-app-un4j.onrender.com\n');
  
  try {
    // Test registration on production
    const testUser = {
      username: 'testuser' + Date.now(),
      email: 'dhanyasrikalisamy@gmail.com', // Your real email
      password: 'testpassword123'
    };
    
    console.log('📝 Testing registration on production...');
    console.log('📧 Email:', testUser.email);
    console.log('🌐 URL: https://blogspace-app-un4j.onrender.com/api/user');
    console.log('');
    
    const response = await fetch('https://blogspace-app-un4j.onrender.com/api/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    });
    
    const result = await response.json();
    
    console.log('📋 Response Status:', response.status);
    console.log('📋 Response:', JSON.stringify(result, null, 2));
    
    if (response.ok) {
      console.log('');
      console.log('✅ Registration API works on production!');
      console.log('📧 Check your email inbox for verification email');
      console.log('🔗 Verification link should point to: https://blogspace-app-un4j.onrender.com/api/user/verify?token=...');
      
      if (result.verifyLink) {
        console.log('🔗 Verification link:', result.verifyLink);
      }
    } else {
      console.log('');
      console.log('❌ Registration failed on production');
      
      if (result.message && result.message.includes('Email already registered')) {
        console.log('📝 Note: This email is already registered, which is expected');
        console.log('✅ The API is working, just use a different email');
      } else {
        console.log('🔍 Check if environment variables are set on Render');
        console.log('📖 See RENDER_SETUP_GUIDE.md for setup instructions');
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('');
    console.log('🔍 Possible issues:');
    console.log('   - Production site is down');
    console.log('   - Network connectivity issues');
    console.log('   - Environment variables not set on Render');
  }
}

testProductionRegistration();