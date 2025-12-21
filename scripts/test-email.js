const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.local' });

async function testGmail() {
  try {
    console.log('🧪 Testing Gmail configuration...');
    console.log('Email:', process.env.SMTP_USER);
    
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Test email to your Gmail
    const testEmail = {
      from: process.env.FROM_EMAIL,
      to: 'dhanyasrikalisamy@gmail.com',
      subject: '✅ BlogSpace Email Verification Working!',
      html: `
        <h2>🎉 Gmail SMTP Setup Successful!</h2>
        <p>Your BlogSpace application is now sending real emails via Gmail.</p>
        <p><strong>Configuration Details:</strong></p>
        <ul>
          <li>From: ${process.env.FROM_EMAIL}</li>
          <li>SMTP Host: ${process.env.SMTP_HOST}</li>
          <li>Test Time: ${new Date().toLocaleString()}</li>
        </ul>
        <p><strong>✅ Ready for user registration testing!</strong></p>
        <p>Users will now receive verification emails in their real inbox.</p>
      `,
    };

    console.log('📧 Sending test email to your Gmail...');
    const result = await transporter.sendMail(testEmail);
    
    console.log('✅ Email sent successfully!');
    console.log('📬 Check your Gmail inbox now!');
    console.log('Message ID:', result.messageId);
    console.log('');
    console.log('🚀 Ready to test user registration!');
    console.log('   1. Start server: npm run dev');
    console.log('   2. Go to: http://localhost:3000/register');
    console.log('   3. Register with any real email address');
    console.log('   4. Check that email inbox for verification');
    
  } catch (error) {
    console.error('❌ Gmail test failed:', error.message);
    
    if (error.message.includes('Invalid login')) {
      console.log('');
      console.log('💡 Try these fixes:');
      console.log('- Make sure you copied the app password correctly');
      console.log('- App password should be: xwhl wzfk kqef mvwh');
      console.log('- Make sure 2FA is enabled on your Gmail');
    }
  }
}

testGmail();