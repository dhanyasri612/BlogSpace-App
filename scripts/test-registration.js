const fetch = require('node-fetch');

async function testRegistration() {
  try {
    console.log('🧪 Testing complete registration and verification flow...');
    
    // Test registration
    const testUser = {
      username: 'testuser' + Date.now(),
      email: 'dhanyasrikalisamy@gmail.com', // Use your real email for testing
      password: 'testpassword123'
    };
    
    console.log('📝 Registering user:', testUser.email);
    
    const response = await fetch('http://localhost:3000/api/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    });
    
    const result = await response.json();
    console.log('Registration response:', result);
    
    if (result.verifyLink) {
      console.log('');
      console.log('✅ Registration successful!');
      console.log('🔗 Verification link:', result.verifyLink);
      
      // Test the verification link
      console.log('');
      console.log('🔍 Testing verification link...');
      
      const verifyResponse = await fetch(result.verifyLink);
      const verifyResult = await verifyResponse.json();
      
      console.log('Verification response:', verifyResult);
      
      if (verifyResult.message === 'Email verified successfully') {
        console.log('');
        console.log('🎉 COMPLETE SUCCESS!');
        console.log('✅ Registration works');
        console.log('✅ Email verification works');
        console.log('✅ Your system is fully functional!');
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testRegistration();