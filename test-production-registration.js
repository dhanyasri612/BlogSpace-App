const fetch = require('node-fetch');

async function testProductionRegistration() {
  console.log('🧪 Testing Production Registration\n');
  
  const productionURL = 'https://blogspace-app-un4j.onrender.com';
  
  const testUser = {
    username: 'testuser' + Date.now(),
    email: 'dhanyasrikalisamy+test' + Date.now() + '@gmail.com',
    password: 'testpass123'
  };
  
  console.log(`📧 Testing registration with: ${testUser.email}`);
  
  try {
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
    
    if (result.verifyLink) {
      console.log(`🔗 Verification Link: ${result.verifyLink}`);
    }
    
    if (response.status === 201) {
      if (result.message.includes('verification email was sent')) {
        console.log('✅ Registration successful - email should be sent');
        console.log('📧 Check dhanyasrikalisamy@gmail.com inbox');
        console.log('📁 Also check spam/promotions folder');
      } else {
        console.log('⚠️  Registration successful but email delivery failed');
        console.log('🔧 SMTP connection likely blocked by Render');
      }
    } else {
      console.log('❌ Registration failed');
    }
    
  } catch (error) {
    console.log(`❌ Request failed: ${error.message}`);
  }
  
  console.log('\n📋 If email still fails after updating SMTP settings:');
  console.log('   1. Render may be blocking all SMTP connections');
  console.log('   2. Consider using a webhook-based email service');
  console.log('   3. Or use a different hosting platform that allows SMTP');
}

testProductionRegistration();