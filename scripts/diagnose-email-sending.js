const fetch = require('node-fetch');

async function diagnoseEmailSending() {
  console.log('🔍 Diagnosing Email Sending Issues\n');
  
  const productionURL = 'https://blogspace-app-un4j.onrender.com';
  
  // Test registration with a unique email
  const testUser = {
    username: 'emailtest' + Date.now(),
    email: 'dhanyasrikalisamy+test' + Date.now() + '@gmail.com', // Using + addressing
    password: 'testpass123'
  };
  
  console.log('📧 Testing registration with email sending...');
  console.log(`   Email: ${testUser.email}`);
  console.log(`   Username: ${testUser.username}\n`);
  
  try {
    const response = await fetch(`${productionURL}/api/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    });
    
    const result = await response.json();
    
    console.log(`📊 Response Status: ${response.status}`);
    console.log(`📝 Response Message: ${result.message}`);
    
    if (result.verifyLink) {
      console.log(`🔗 Verification Link: ${result.verifyLink}`);
    }
    
    if (result.error) {
      console.log(`❌ Error: ${result.error}`);
    }
    
    console.log('\n🔍 Analysis:');
    
    if (response.status === 201) {
      console.log('   ✅ Registration successful');
      console.log('   📧 Check your email inbox for verification email');
      console.log('   📁 Also check spam/junk folder');
      console.log('   ⏰ Email delivery can take 1-5 minutes');
      
      if (result.message.includes('verification email was sent')) {
        console.log('\n⚠️  Potential Issues:');
        console.log('   1. Environment variables not set on Render');
        console.log('   2. Gmail app password expired or incorrect');
        console.log('   3. Gmail account security settings blocking the app');
        console.log('   4. SMTP configuration issues on production server');
        console.log('   5. Email being sent but going to spam folder');
      }
    } else {
      console.log('   ❌ Registration failed');
    }
    
  } catch (error) {
    console.log(`❌ Request failed: ${error.message}`);
  }
  
  console.log('\n🛠️  Troubleshooting Steps:');
  console.log('   1. Verify environment variables are set on Render');
  console.log('   2. Check Gmail app password is still valid');
  console.log('   3. Ensure Gmail "Less secure app access" is enabled (if needed)');
  console.log('   4. Check Render deployment logs for email errors');
  console.log('   5. Test with a different email provider if Gmail fails');
}

diagnoseEmailSending();