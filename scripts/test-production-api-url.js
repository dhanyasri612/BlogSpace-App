const fetch = require('node-fetch');

async function testProductionAPIURL() {
  console.log('🧪 Testing Production API URL Configuration\n');
  
  const productionURL = 'https://blogspace-app-un4j.onrender.com';
  const testEmail = 'test@example.com';
  
  console.log('📍 Testing email validation API on production...');
  
  try {
    const response = await fetch(`${productionURL}/api/validate-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: testEmail }),
    });
    
    console.log(`   Status: ${response.status}`);
    
    if (response.ok) {
      const result = await response.json();
      console.log('   ✅ API is accessible');
      console.log(`   Response: ${JSON.stringify(result, null, 2)}`);
    } else {
      console.log('   ❌ API returned error');
      const errorText = await response.text();
      console.log(`   Error: ${errorText}`);
    }
    
  } catch (error) {
    console.log(`   ❌ Request failed: ${error.message}`);
  }
  
  console.log('\n🔍 Issue Analysis:');
  console.log('   The frontend is configured to call localhost:3000/api in production');
  console.log('   This causes API calls to fail because localhost doesn\'t exist on the production server');
  console.log('   The NEXT_PUBLIC_API_URL should be set to the production URL');
}

testProductionAPIURL();