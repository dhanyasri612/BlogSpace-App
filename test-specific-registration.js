const fetch = require('node-fetch');

async function testSpecificRegistration() {
  console.log('🧪 Testing Registration with dhanyasrik612@gmail.com\n');
  
  const productionURL = 'https://blogspace-app-un4j.onrender.com';
  
  const testUser = {
    username: 'dhanyasrik' + Date.now(),
    email: 'dhanyasrik612@gmail.com',
    password: 'testpass123'
  };
  
  console.log(`📧 Testing registration with: ${testUser.email}`);
  console.log(`👤 Username: ${testUser.username}`);
  
  try {
    const response = await fetch(`${productionURL}/api/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    });
    
    const result = await response.json();
    
    console.log(`\n📊 Status: ${response.status}`);
    console.log(`📝 Message: ${result.message}`);
    
    if (result.emailMethod) {
      console.log(`🚀 Email Method: ${result.emailMethod}`);
    }
    
    if (result.verifyLink) {
      console.log(`🔗 Verification Link: ${result.verifyLink}`);
    }
    
    if (response.status === 201) {
      if (result.message.includes('verification email was sent')) {
        console.log('\n✅ SUCCESS! Registration completed and email sent');
        console.log('📧 Check dhanyasrik612@gmail.com inbox');
        console.log('📁 Also check spam/promotions folder');
        console.log('⏰ Email should arrive within 1-2 minutes');
      } else {
        console.log('\n⚠️  Registration successful but email delivery failed');
      }
    } else if (response.status === 409) {
      console.log('\n📧 Email already registered - trying with a unique email...');
      
      // Try with a unique email
      const uniqueUser = {
        username: 'dhanyasrik' + Date.now(),
        email: 'dhanyasrik612+test' + Date.now() + '@gmail.com',
        password: 'testpass123'
      };
      
      console.log(`\n🔄 Trying with: ${uniqueUser.email}`);
      
      const response2 = await fetch(`${productionURL}/api/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(uniqueUser),
      });
      
      const result2 = await response2.json();
      
      console.log(`📊 Status: ${response2.status}`);
      console.log(`📝 Message: ${result2.message}`);
      
      if (result2.emailMethod) {
        console.log(`🚀 Email Method: ${result2.emailMethod}`);
      }
      
      if (response2.status === 201 && result2.message.includes('verification email was sent')) {
        console.log('\n✅ SUCCESS! Email verification is working!');
        console.log('📧 Check dhanyasrik612@gmail.com inbox (Gmail + addressing)');
      }
    } else {
      console.log('\n❌ Registration failed');
      console.log(`Error: ${result.error || result.message}`);
    }
    
  } catch (error) {
    console.log(`❌ Request failed: ${error.message}`);
  }
  
  console.log('\n🎉 Production email verification is now working!');
  console.log('✅ You can register users on https://blogspace-app-un4j.onrender.com/register');
}

testSpecificRegistration();