const fetch = require('node-fetch');

async function testFrontendValidation() {
  console.log('🧪 Testing frontend email validation API\n');
  
  const testEmails = [
    '23am018@kpriet.ac.in',
    'dhanyasrikalisamy@gmail.com',
    'invalid@nonexistentdomain123.com',
    'user@10minutemail.com'
  ];
  
  for (const email of testEmails) {
    console.log(`📧 Testing: ${email}`);
    
    try {
      const response = await fetch('http://localhost:3000/api/validate-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const result = await response.json();
      
      console.log(`   Status: ${response.status}`);
      console.log(`   Valid: ${result.isValid}`);
      if (result.errors) {
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
}

console.log('🚀 Make sure your Next.js server is running on localhost:3000\n');
testFrontendValidation();