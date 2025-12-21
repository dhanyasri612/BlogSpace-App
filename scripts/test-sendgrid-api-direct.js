const fetch = require('node-fetch');

async function testSendGridAPIDirect() {
  console.log('🔍 Testing SendGrid API Directly\n');
  
  const productionURL = 'https://blogspace-app-un4j.onrender.com';
  
  // Test the SendGrid API endpoint directly
  console.log('📧 Testing SendGrid API configuration...');
  
  try {
    const response = await fetch(`${productionURL}/api/test-smtp`, {
      method: 'GET',
    });
    
    const result = await response.json();
    
    console.log(`📊 Status: ${response.status}`);
    console.log(`📝 Response:`, JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log('✅ SendGrid API is working!');
      console.log('📧 Check dhanyasrikalisamy@gmail.com for test email');
    } else {
      console.log('❌ SendGrid API failed');
      console.log(`🔍 Error: ${result.error}`);
      
      if (result.error && result.error.includes('401')) {
        console.log('\n🔑 API Key Issue:');
        console.log('   - API key might be incorrect');
        console.log('   - Check if SENDGRID_API_KEY is set correctly on Render');
        console.log('   - Verify the API key has Mail Send permissions');
      } else if (result.error && result.error.includes('403')) {
        console.log('\n🚫 Permission Issue:');
        console.log('   - API key lacks Mail Send permissions');
        console.log('   - Go to SendGrid → Settings → API Keys');
        console.log('   - Edit the API key and enable Mail Send');
      }
    }
    
  } catch (error) {
    console.log(`❌ Request failed: ${error.message}`);
  }
  
  console.log('\n🧪 Now testing registration flow...');
  
  // Test registration
  const testUser = {
    username: 'debugtest' + Date.now(),
    email: 'dhanyasrikalisamy+debug' + Date.now() + '@gmail.com',
    password: 'testpass123'
  };
  
  try {
    const response = await fetch(`${productionURL}/api/user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser),
    });
    
    const result = await response.json();
    
    console.log(`📊 Registration Status: ${response.status}`);
    console.log(`📝 Message: ${result.message}`);
    console.log(`📧 Email Sent: ${result.emailSent}`);
    
    if (result.emailMethod) {
      console.log(`🚀 Email Method Used: ${result.emailMethod}`);
    }
    
    if (result.warning) {
      console.log(`⚠️  Warning: ${result.warning}`);
    }
    
  } catch (error) {
    console.log(`❌ Registration test failed: ${error.message}`);
  }
  
  console.log('\n📋 Debugging Checklist:');
  console.log('   1. ✓ SendGrid account created');
  console.log('   2. ✓ API key generated');
  console.log('   3. ✓ API key added to Render');
  console.log('   4. ? Deployment completed with new environment variable');
  console.log('   5. ? API key has correct permissions');
  console.log('   6. ? SendGrid API is accessible from Render');
}

testSendGridAPIDirect();