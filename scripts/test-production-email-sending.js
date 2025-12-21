const fetch = require('node-fetch');

async function testProductionEmailSending() {
  console.log('🧪 Testing email sending on production\n');
  
  try {
    // Use Gmail + addressing to create unique email
    const timestamp = Date.now();
    const testUser = {
      username: 'testuser' + timestamp,
      email: `dhanyasrikalisamy+test${timestamp}@gmail.com`,
      password: 'testpassword123'
    };
    
    console.log('📝 Testing email sending on production...');
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
      console.log('✅ Registration successful on production!');
      console.log('📧 Email should be sent to:', testUser.email);
      console.log('📬 Check your Gmail inbox (including spam folder)');
      console.log('🔗 Verification link should point to production URL');
      
      if (result.verifyLink) {
        console.log('🔗 Verification link:', result.verifyLink);
        
        if (result.verifyLink.includes('https://blogspace-app-un4j.onrender.com')) {
          console.log('✅ Verification link uses correct production URL!');
        } else {
          console.log('❌ Verification link uses wrong URL!');
        }
      }
      
      console.log('');
      console.log('🎯 What to check:');
      console.log('   1. Check your Gmail inbox for verification email');
      console.log('   2. Check spam folder if not in inbox');
      console.log('   3. Email should come from: dhanyasrikalisamy@gmail.com');
      console.log('   4. Subject should be: "Please verify your email"');
      
    } else {
      console.log('');
      console.log('❌ Registration failed on production');
      console.log('🔍 This suggests environment variables might not be set');
      console.log('📖 Follow RENDER_SETUP_GUIDE.md to set up environment variables');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testProductionEmailSending();