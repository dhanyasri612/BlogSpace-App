const fetch = require('node-fetch');

async function testEmailConfig() {
  console.log('🔍 Checking Email Configuration on Production\n');
  
  const productionURL = 'https://blogspace-app-un4j.onrender.com';
  
  try {
    const response = await fetch(`${productionURL}/api/test-email-config`, {
      method: 'GET',
    });
    
    const result = await response.json();
    
    console.log(`📊 Status: ${response.status}`);
    console.log(`📝 Config:`, JSON.stringify(result.config, null, 2));
    console.log(`💡 Recommendation: ${result.recommendation}`);
    
    if (result.config.resend.configured) {
      console.log('\n✅ Resend API key is configured!');
      console.log('📧 Production emails should work now');
    } else {
      console.log('\n❌ Resend API key is NOT configured');
      console.log('🔧 You need to add RESEND_API_KEY to Render environment variables');
      console.log('\n📋 Steps to fix:');
      console.log('   1. Go to resend.com and create account');
      console.log('   2. Get API key from Resend dashboard');
      console.log('   3. Add RESEND_API_KEY to Render environment variables');
      console.log('   4. Wait for deployment to complete');
    }
    
    if (result.config.smtp.configured) {
      console.log('\n📧 SMTP is configured (fallback for localhost)');
    }
    
  } catch (error) {
    console.log(`❌ Request failed: ${error.message}`);
    console.log('🔄 Make sure deployment completed');
  }
}

console.log('⏰ Wait for deployment to complete, then run this test\n');
testEmailConfig();