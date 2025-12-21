const { validateEmail } = require('../utils/emailValidator.js');

async function testSpecificEmail() {
  console.log('🧪 Testing specific email: 23am018@kpriet.ac.in\n');
  
  const email = '23am018@kpriet.ac.in';
  
  try {
    console.log('📧 Testing email:', email);
    console.log('🏫 Domain: kpriet.ac.in (Educational institution)');
    console.log('');
    
    const result = await validateEmail(email);
    
    console.log('📋 Validation Result:');
    console.log('   Valid:', result.isValid);
    if (result.errors && result.errors.length > 0) {
      console.log('   Errors:', result.errors.join(', '));
    }
    
    // Test individual validation steps
    console.log('');
    console.log('🔍 Step-by-step validation:');
    
    // 1. Format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const formatValid = emailRegex.test(email);
    console.log('   1. Format check:', formatValid ? '✅ Valid' : '❌ Invalid');
    
    // 2. Domain check
    const domain = email.split('@')[1];
    console.log('   2. Domain extracted:', domain);
    
    // 3. Disposable email check
    const disposableDomains = ['10minutemail.com', 'guerrillamail.com', 'mailinator.com'];
    const isDisposable = disposableDomains.includes(domain.toLowerCase());
    console.log('   3. Disposable check:', isDisposable ? '❌ Disposable' : '✅ Not disposable');
    
    // 4. MX record check (this might be failing)
    console.log('   4. MX record check: Testing...');
    
    const dns = require('dns');
    const { promisify } = require('util');
    const resolveMx = promisify(dns.resolveMx);
    
    try {
      const mxRecords = await resolveMx(domain);
      console.log('   4. MX records found:', mxRecords.length, 'records');
      mxRecords.forEach((record, index) => {
        console.log(`      ${index + 1}. ${record.exchange} (priority: ${record.priority})`);
      });
    } catch (dnsError) {
      console.log('   4. MX record error:', dnsError.message);
      console.log('   📝 This is likely why validation is failing!');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testSpecificEmail();