const fetch = require('node-fetch');

async function testFreshInvalidEmails() {
  console.log('🧪 Testing registration with fresh invalid email addresses...\n');
  
  const timestamp = Date.now();
  const invalidEmails = [
    {
      email: 'notanemail',
      description: 'Invalid format (no @ symbol)'
    },
    {
      email: 'user@',
      description: 'Invalid format (no domain)'
    },
    {
      email: `user${timestamp}@nonexistentdomain123.com`,
      description: 'Non-existent domain'
    },
    {
      email: `user${timestamp}@10minutemail.com`,
      description: 'Disposable email service'
    },
    {
      email: `fakeemail${timestamp}@gmail.com`,
      description: 'Fake Gmail address (but valid format and domain)'
    },
    {
      email: `nonexistent${timestamp}@gmail.com`,
      description: 'Non-existent Gmail address'
    }
  ];
  
  for (const testCase of invalidEmails) {
    console.log(`📧 Testing: ${testCase.email}`);
    console.log(`   Type: ${testCase.description}`);
    
    try {
      const response = await fetch('http://localhost:3000/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'testuser' + Date.now() + Math.random().toString(36).slice(2),
          email: testCase.email,
          password: 'testpassword123'
        }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        console.log(`   ✅ Registration allowed: ${result.message}`);
        if (result.verifyLink) {
          console.log(`   🔗 Verification link: ${result.verifyLink}`);
        }
        console.log(`   ⚠️  Email will be sent to: ${testCase.email}`);
        console.log(`   📬 What happens: Email will bounce back to sender if invalid`);
      } else {
        console.log(`   ❌ Registration blocked: ${result.message}`);
        if (result.errors) {
          console.log(`   📝 Errors: ${result.errors.join(', ')}`);
        }
      }
      
    } catch (error) {
      console.log(`   💥 Request failed: ${error.message}`);
    }
    
    console.log('');
  }
}

// Make sure your Next.js server is running on localhost:3000
testFreshInvalidEmails();