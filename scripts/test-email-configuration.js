const nodemailer = require('nodemailer');

async function testEmailConfiguration() {
  console.log('🔧 Testing Email Configuration\n');
  
  // These should match your .env.local values
  const config = {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    user: 'dhanyasrikalisamy@gmail.com',
    pass: 'xwhlwzfkkqefmvwh', // Your app password
    from: 'dhanyasrikalisamy@gmail.com'
  };
  
  console.log('📧 SMTP Configuration:');
  console.log(`   Host: ${config.host}`);
  console.log(`   Port: ${config.port}`);
  console.log(`   Secure: ${config.secure}`);
  console.log(`   User: ${config.user}`);
  console.log(`   Pass: ${config.pass ? '***set***' : 'NOT SET'}`);
  console.log(`   From: ${config.from}\n`);
  
  try {
    console.log('🔌 Creating transporter...');
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.pass
      }
    });
    
    console.log('✅ Transporter created successfully\n');
    
    console.log('🔍 Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully\n');
    
    console.log('📤 Sending test email...');
    const testEmail = {
      from: config.from,
      to: 'dhanyasrikalisamy@gmail.com', // Send to yourself for testing
      subject: 'Test Email from BlogSpace App',
      html: `
        <h2>Email Configuration Test</h2>
        <p>This is a test email to verify that your email configuration is working.</p>
        <p>If you receive this email, your SMTP setup is correct!</p>
        <p>Sent at: ${new Date().toISOString()}</p>
      `
    };
    
    const result = await transporter.sendMail(testEmail);
    console.log('✅ Test email sent successfully!');
    console.log(`   Message ID: ${result.messageId}`);
    console.log(`   Response: ${result.response}\n`);
    
    console.log('🎉 Email configuration is working correctly!');
    console.log('📧 Check your inbox for the test email');
    
  } catch (error) {
    console.log('❌ Email configuration test failed:');
    console.log(`   Error: ${error.message}`);
    
    if (error.code === 'EAUTH') {
      console.log('\n🔐 Authentication Error - Possible causes:');
      console.log('   1. App password is incorrect or expired');
      console.log('   2. 2-factor authentication not enabled on Gmail');
      console.log('   3. App password not generated correctly');
      console.log('\n🛠️  Fix: Generate a new Gmail app password:');
      console.log('   1. Go to Google Account settings');
      console.log('   2. Security > 2-Step Verification');
      console.log('   3. App passwords > Generate new password');
      console.log('   4. Use the 16-character password (no spaces)');
    } else if (error.code === 'ECONNECTION') {
      console.log('\n🌐 Connection Error - Possible causes:');
      console.log('   1. Network connectivity issues');
      console.log('   2. Firewall blocking SMTP port 587');
      console.log('   3. Gmail SMTP server temporarily unavailable');
    } else {
      console.log(`\n🔍 Error Code: ${error.code}`);
      console.log(`   Full Error: ${JSON.stringify(error, null, 2)}`);
    }
  }
}

console.log('🧪 Testing Email Configuration Locally');
console.log('📝 This will test if your Gmail SMTP setup works\n');
testEmailConfiguration();