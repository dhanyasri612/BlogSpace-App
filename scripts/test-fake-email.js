const { validateEmail } = require('../utils/emailValidator.js');

async function testFakeEmails() {
  console.log('🧪 Testing fake email detection...\n');
  
  const testEmails = [
    'abc123@gmail.com',
    'fakeemail999@gmail.com',
    'notreal@gmail.com',
    'dhanyasrikalisamy@gmail.com', // Real email
    'test@nonexistentdomain123.com',
    'user@10minutemail.com'
  ];
  
  for (const email of testEmails) {
    console.log(`Testing: ${email}`);
    const result = await validateEmail(email);
    
    if (result.isValid) {
      console.log('✅ Valid email');
    } else {
      console.log(`❌ Invalid: ${result.errors.join(', ')}`);
    }
    console.log('');
  }
}

testFakeEmails();