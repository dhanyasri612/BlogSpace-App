const fetch = require('node-fetch');

async function testSendGridConfig() {
  console.log('📧 Testing SendGrid Configuration\n');
  
  const productionURL = 'https://blogspace-app-un4j.onrender.com';
  
  console.log('🔧 Step 1: Testing SMTP connection with SendGrid...');
  
  try {
    const response = await fetch(`${productionURL}/api/test-smtp`, {
      method: 'GET',
    });
    
    const result = await response.json();
    
    console.log(`📊 Status: ${response.status}`);
    
    if (result.success) {
      console.log('✅ SendGrid SMTP Test Successful!');
      console.log(`📧 Message ID: ${result.messageId}`);
      console.log('\n🎉 SendGrid is working! Now testing registration...\n');
      
      // Test registration flow
      const testUser = {
        username: 'sendgridtest' + Date.now(),
        email: 'dhanyasrikalisamy+sendgrid' + Date.now() + '@gmail.com',
        password: 'testpass123'
      };
      
      console.log('📝 Testing registration with SendGrid...');
      console.log(`   Email: ${testUser.email}`);
      
      const regResponse = await fetch(`${productionURL}/api/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testUser),
      });
      
      const regResult = await regResponse.json();
      
      console.log(`📊 Registration Status: ${regResponse.status}`);
      console.log(`📝 Message: ${regResult.message}`);
      
      if (regResult.emailSent === true) {
        console.log('✅ SUCCESS! Email sent via SendGrid');
        console.log('📧 Check your inbox for the verification email');
      } else {
        console.log('❌ Registration email still failed');
        console.log(`   Warning: ${regResult.warning}`);
      }
      
    } else {
      console.log('❌ SendGrid SMTP Test Failed');
      console.log(`🔍 Error: ${result.error}`);
      console.log(`📋 Error Code: ${result.code}`);
      
      if (result.code === 'EAUTH') {
        console.log('\n🔑 Authentication Error:');
        console.log('   - SendGrid API key is incorrect');
        console.log('   - Make sure SMTP_USER is set to "apikey"');
        console.log('   - Make sure SMTP_PASS is your SendGrid API key');
      }
    }
    
  } catch (error) {
    console.log(`❌ Request failed: ${error.message}`);
  }
  
  console.log('\n📋 SendGrid Setup Checklist:');
  console.log('   ✓ Create SendGrid account');
  console.log('   ✓ Generate API key with Mail Send permissions');
  console.log('   ✓ Update Render environment variables:');
  console.log('     - SMTP_HOST=smtp.sendgrid.net');
  console.log('     - SMTP_PORT=587');
  console.log('     - SMTP_SECURE=false');
  console.log('     - SMTP_USER=apikey');
  console.log('     - SMTP_PASS=your_sendgrid_api_key');
  console.log('     - FROM_EMAIL=dhanyasrikalisamy@gmail.com');
}

testSendGridConfig();