const fetch = require('node-fetch');

async function testProductionEmailDetailed() {
  console.log('🔍 Detailed Production Email Test\n');
  
  const productionURL = 'https://blogspace-app-un4j.onrender.com';
  
  // Test with a unique email using Gmail + addressing
  const testUser = {
    username: 'prodtest' + Date.now(),
    email: 'dhanyasrikalisamy+prodtest' + Date.now() + '@gmail.com',
    password: 'testpass123'
  };
  
  console.log('📧 Testing registration with detailed logging...');
  console.log(`   Email: ${testUser.email}`);
  console.log(`   This email will go to: dhanyasrikalisamy@gmail.com`);
  console.log(`   (Gmail + addressing forwards to main inbox)\n`);
  
  try {
    console.log('📤 Sending registration request...');
    const response = await fetch(`${productionURL}/api/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    });
    
    const result = await response.json();
    
    console.log(`📊 Status: ${response.status}`);
    console.log(`📝 Message: ${result.message}`);
    
    // Check the new fields we added
    if (result.emailSent !== undefined) {
      console.log(`📧 Email Actually Sent: ${result.emailSent}`);
    }
    
    if (result.warning) {
      console.log(`⚠️  Warning: ${result.warning}`);
    }
    
    if (result.verifyLink) {
      console.log(`🔗 Verification Link: ${result.verifyLink}`);
    }
    
    console.log('\n🔍 Analysis:');
    
    if (response.status === 201) {
      if (result.emailSent === true) {
        console.log('   ✅ Registration successful AND email was sent');
        console.log('   📧 Check dhanyasrikalisamy@gmail.com inbox');
        console.log('   📁 Also check spam/promotions folder');
        console.log('   ⏰ Email may take 1-2 minutes to arrive');
      } else if (result.emailSent === false) {
        console.log('   ⚠️  Registration successful BUT email failed to send');
        console.log('   🔧 Check Render deployment logs for SMTP errors');
        console.log('   📋 Possible issues:');
        console.log('      - Gmail app password expired');
        console.log('      - SMTP connection blocked by Render');
        console.log('      - Gmail security settings changed');
      } else {
        console.log('   ❓ Email send status unclear (using old API response)');
        console.log('   🔄 Wait for deployment to complete with new code');
      }
    } else {
      console.log('   ❌ Registration failed');
      console.log(`   Error: ${result.error || result.message}`);
    }
    
  } catch (error) {
    console.log(`❌ Request failed: ${error.message}`);
  }
  
  console.log('\n📋 Next Steps:');
  console.log('   1. Wait 2-3 minutes for email delivery');
  console.log('   2. Check all email folders (inbox, spam, promotions)');
  console.log('   3. If no email, check Render deployment logs');
  console.log('   4. Verify the latest code deployment is active');
}

testProductionEmailDetailed();