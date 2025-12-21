const fetch = require('node-fetch');

async function testProductionEmailValidation() {
  console.log('🧪 Testing Email Validation in Production Environment\n');
  
  const productionURL = 'https://blogspace-app-un4j.onrender.com';
  
  const testEmails = [
    {
      email: '23am018@kpriet.ac.in',
      description: 'Valid institutional email'
    },
    {
      email: 'dhanyasrikalisamy@gmail.com', 
      description: 'Valid Gmail address'
    },
    {
      email: 'invalid@nonexistentdomain123.com',
      description: 'Invalid domain'
    },
    {
      email: 'user@10minutemail.com',
      description: 'Disposable email'
    },
    {
      email: 'test@gmail.com',
      description: 'Valid Gmail format'
    }
  ];
  
  console.log('🔍 Testing email validation API endpoint...\n');
  
  for (const test of testEmails) {
    console.log(`📧 Testing: ${test.email} (${test.description})`);
    
    try {
      const response = await fetch(`${productionURL}/api/validate-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: test.email }),
      });
      
      const result = await response.json();
      
      console.log(`   Status: ${response.status}`);
      console.log(`   Valid: ${result.isValid}`);
      if (result.errors && result.errors.length > 0) {
        console.log(`   Errors: ${result.errors.join(', ')}`);
      }
      if (result.message) {
        console.log(`   Message: ${result.message}`);
      }
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
      
    } catch (error) {
      console.log(`   ❌ Request failed: ${error.message}`);
    }
    
    console.log('');
  }
  
  console.log('🧪 Testing full registration flow...\n');
  
  const testUser = {
    username: 'testuser' + Date.now(),
    email: 'test' + Date.now() + '@gmail.com',
    password: 'testpass123'
  };
  
  console.log(`📝 Testing registration with: ${testUser.email}`);
  
  try {
    const response = await fetch(`${productionURL}/api/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    });
    
    const result = await response.json();
    
    console.log(`   Status: ${response.status}`);
    console.log(`   Response: ${JSON.stringify(result, null, 2)}`);
    
  } catch (error) {
    console.log(`   ❌ Registration failed: ${error.message}`);
  }
  
  console.log('\n📋 Diagnosis:');
  console.log('   1. Check if API endpoints are accessible');
  console.log('   2. Verify DNS resolution works in production');
  console.log('   3. Test email validation logic');
  console.log('   4. Confirm environment variables are set correctly');
}

testProductionEmailValidation();