const fetch = require('node-fetch');

async function testProductionEmailLinksUnique() {
  console.log('🧪 Testing email verification links with production URL...\n');
  
  try {
    // Create a unique email for testing
    const timestamp = Date.now();
    const testUser = {
      username: 'testuser' + timestamp,
      email: `dhanyasrikalisamy+test${timestamp}@gmail.com`, // Gmail + addressing
      password: 'testpassword123'
    };
    
    console.log('📝 Registering user:', testUser.email);
    console.log('🌐 Expected verification link domain: https://blogspace-app-un4j.onrender.com');
    console.log('');
    
    const response = await fetch('http://localhost:3000/api/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Registration successful!');
      console.log('📧 Message:', result.message);
      
      if (result.verifyLink) {
        console.log('🔗 Verification link:', result.verifyLink);
        
        // Check if the link uses the correct domain
        if (result.verifyLink.includes('https://blogspace-app-un4j.onrender.com')) {
          console.log('✅ Perfect! Verification link uses correct production URL!');
          console.log('');
          console.log('📧 Email will be sent with this verification link:');
          console.log('   ' + result.verifyLink);
          console.log('');
          console.log('💌 Check your email inbox for the verification email');
        } else {
          console.log('❌ Issue: Verification link still uses wrong URL!');
          console.log('   Expected: https://blogspace-app-un4j.onrender.com/api/user/verify?token=...');
          console.log('   Got:', result.verifyLink);
        }
      } else {
        console.log('📧 Verification link not returned in response');
        console.log('💌 Check your email for the verification link');
        console.log('🔍 The email should contain a link to: https://blogspace-app-un4j.onrender.com/api/user/verify?token=...');
      }
      
    } else {
      console.log('❌ Registration failed:', result.message);
      if (result.errors) {
        console.log('📝 Errors:', result.errors.join(', '));
      }
    }
    
  } catch (error) {
    console.error('💥 Test failed:', error.message);
  }
}

console.log('🚀 Make sure your Next.js server is running on localhost:3000');
console.log('📧 This will send a real email using Gmail + addressing');
console.log('');

testProductionEmailLinksUnique();