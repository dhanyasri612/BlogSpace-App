// Simple test file to verify email validation
// Run with: node utils/test-email-validation.js

import { validateEmail, isDisposableEmail, isValidEmailFormat } from './emailValidator.js';

async function testEmailValidation() {
  console.log('Testing Email Validation...\n');

  const testEmails = [
    'test@gmail.com',           // Should be valid
    'user@yahoo.com',           // Should be valid  
    'fake@nonexistentdomain123456.com', // Should fail MX check
    'test@10minutemail.com',    // Should fail disposable check
    'invalid-email',            // Should fail format check
    'test@',                    // Should fail format check
    '@gmail.com',               // Should fail format check
  ];

  for (const email of testEmails) {
    console.log(`Testing: ${email}`);
    
    // Test format validation
    const formatValid = isValidEmailFormat(email);
    console.log(`  Format valid: ${formatValid}`);
    
    // Test disposable check
    const isDisposable = isDisposableEmail(email);
    console.log(`  Is disposable: ${isDisposable}`);
    
    // Test full validation
    try {
      const result = await validateEmail(email);
      console.log(`  Full validation: ${result.isValid ? 'VALID' : 'INVALID'}`);
      if (!result.isValid) {
        console.log(`  Errors: ${result.errors.join(', ')}`);
      }
    } catch (error) {
      console.log(`  Error: ${error.message}`);
    }
    
    console.log('');
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testEmailValidation().catch(console.error);
}