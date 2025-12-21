const nodemailer = require('nodemailer');

async function createTestAccount() {
  try {
    // Generate test SMTP service account from ethereal.email
    const testAccount = await nodemailer.createTestAccount();
    
    console.log('=== EMAIL SETUP CREDENTIALS ===');
    console.log('Add these to your .env.local file:');
    console.log('');
    console.log(`SMTP_HOST=smtp.ethereal.email`);
    console.log(`SMTP_PORT=587`);
    console.log(`SMTP_SECURE=false`);
    console.log(`SMTP_USER=${testAccount.user}`);
    console.log(`SMTP_PASS=${testAccount.pass}`);
    console.log(`FROM_EMAIL=noreply@blogspace.com`);
    console.log('');
    console.log('=== IMPORTANT ===');
    console.log('Emails will be captured at: https://ethereal.email/messages');
    console.log(`Login with: ${testAccount.user} / ${testAccount.pass}`);
    console.log('');
    
    return testAccount;
  } catch (error) {
    console.error('Error creating test account:', error);
  }
}

createTestAccount();