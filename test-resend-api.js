const fetch = require('node-fetch');

async function testResendAPI() {
  console.log('🧪 Testing Resend API Directly\n');
  
  const productionURL = 'https://blogspace-app-un4j.onrender.com';
  
  try {
    console.log('📡 Calling Resend API test endpoint...');
    
    const response = await fetch(`${productionURL}/api/test-resend`, {
      method: 'GET',
    });
    
    const result = await response.json();
    
    console.log(`📊 Status: ${response.status}`);
    console.log(`📝 Response:`, JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log('\n✅ Resend API is working!');
      console.log('📧 Check dhanyasrikalisamy@gmail.com for test email');
      console.log('\n🎉 Your production emails should work now!');
      console.log('🔄 Try registering again on your site');
    } else {
      console.log('\n❌ Resend API failed');
      console.log(`🔍 Error: ${result.error}`);
      
      if (result.error && result.error.includes('401')) {
        console.log('\n🔑 Authentication Error:');
        console.log('   - Resend API key is incorrect');
        console.log('   - Double-check the API key on Render');
      } else if (result.error && result.error.includes('403')) {
        console.log('\n🚫 Permission Error:');
        console.log('   - API key lacks email sending permissions');
        console.log('   - Check Resend dashboard for API key permissions');
      } else if (result.error && result.error.includes('422')) {
        console.log('\n📧 Email Validation Error:');
        console.log('   - From email address needs to be verified in Resend');
        console.log('   - Go to Resend dashboard → Domains');
        console.log('   - Verify your sender email or use onboarding@resend.dev');
      } else {
        console.log('\n❓ Unknown error - check details above');
      }
    }
    
  } catch (error) {
    console.log(`❌ Request failed: ${error.message}`);
    console.log('🔄 Make sure deployment completed');
  }
}

console.log('⏰ Wait for deployment to complete (2-3 minutes)\n');
testResendAPI();