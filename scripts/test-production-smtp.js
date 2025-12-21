const fetch = require('node-fetch');

async function testProductionSMTP() {
  console.log('🔧 Testing SMTP Connection on Production Server\n');
  
  const productionURL = 'https://blogspace-app-un4j.onrender.com';
  
  console.log('📡 Calling SMTP test endpoint...');
  console.log('⏰ This will test the actual SMTP connection on Render\n');
  
  try {
    const response = await fetch(`${productionURL}/api/test-smtp`, {
      method: 'GET',
    });
    
    const result = await response.json();
    
    console.log(`📊 Status: ${response.status}`);
    
    if (result.success) {
      console.log('✅ SMTP Test Successful!');
      console.log(`📧 Message ID: ${result.messageId}`);
      console.log(`📤 Response: ${result.response}`);
      console.log('\n🎉 Email configuration is working on production!');
      console.log('📧 Check dhanyasrikalisamy@gmail.com for the test email');
      console.log('\n💡 If registration emails still fail, the issue might be:');
      console.log('   - Race condition in the registration process');
      console.log('   - Different error handling in the registration flow');
    } else {
      console.log('❌ SMTP Test Failed');
      console.log(`🔍 Error: ${result.error}`);
      console.log(`📋 Error Code: ${result.code}`);
      
      if (result.details) {
        console.log('🔧 Error Details:', JSON.stringify(result.details, null, 2));
      }
      
      console.log('\n🛠️  Troubleshooting:');
      
      if (result.code === 'EAUTH') {
        console.log('   🔐 Authentication Error:');
        console.log('      - Gmail app password is incorrect or expired');
        console.log('      - Generate new app password and update SMTP_PASS');
      } else if (result.code === 'ECONNECTION' || result.code === 'ETIMEDOUT') {
        console.log('   🌐 Connection Error:');
        console.log('      - Render may be blocking outbound SMTP connections');
        console.log('      - Try using port 465 with secure: true');
        console.log('      - Consider using a different email service (SendGrid, etc.)');
      } else if (result.code === 'ENOTFOUND') {
        console.log('   🔍 DNS Error:');
        console.log('      - Cannot resolve smtp.gmail.com');
        console.log('      - Network connectivity issue on Render');
      } else {
        console.log('   ❓ Unknown error - check Render deployment logs');
      }
    }
    
  } catch (error) {
    console.log(`❌ Request failed: ${error.message}`);
    console.log('🔄 Make sure the deployment has completed');
  }
}

console.log('🚀 Wait for deployment to complete, then run this test');
console.log('⏰ Deployment usually takes 2-3 minutes\n');
testProductionSMTP();