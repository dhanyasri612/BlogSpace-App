const fetch = require('node-fetch');

async function testProductionEmailLinks() {
  console.log('🧪 Testing email verification links with production URL...\n');
  
  try {
    // Test registration with your real email
    const testUser = {
      username: 'testuser' + Date.now(),
      email: 'dhanyasrikalisamy@gmail.com', // Your real email
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
          console.log('✅ Verification link uses correct production URL!');
        } else {
          console.log('❌ Verification link still uses localhost!');
          console.log('   Expected: https://blogspace-app-un4j.onrender.com/api/user/verify?token=...');
          console.log('   Got:', result.verifyLink);
        }
      } else {
        console.log('📧 Verification link not returned (normal for production)');
        console.log('💌 Check your email for the verification link');
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
console.log('📧 This will send a real email to dhanyasrikalisamy@gmail.com');
console.log('');

testProductionEmailLinks();