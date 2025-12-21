/**
 * SendGrid HTTP API Email Sender
 * More reliable than SMTP for hosting platforms
 */

export async function sendVerificationEmail(to, username, verifyLink) {
  const sendGridApiKey = process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.FROM_EMAIL || 'dhanyasrikalisamy@gmail.com';
  
  if (!sendGridApiKey) {
    throw new Error('SENDGRID_API_KEY environment variable not set');
  }
  
  const emailData = {
    personalizations: [
      {
        to: [{ email: to }],
        subject: 'Please verify your email - BlogSpace'
      }
    ],
    from: { email: fromEmail },
    content: [
      {
        type: 'text/html',
        value: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Welcome to BlogSpace!</h2>
            <p>Hi ${username},</p>
            <p>Thanks for registering with BlogSpace. Please click the button below to verify your email address:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verifyLink}" 
                 style="background-color: #007bff; color: white; padding: 12px 30px; 
                        text-decoration: none; border-radius: 5px; display: inline-block;">
                Verify Email Address
              </a>
            </div>
            
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #666;">${verifyLink}</p>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 12px;">
              This email was sent from BlogSpace. If you didn't create an account, you can safely ignore this email.
            </p>
          </div>
        `
      }
    ]
  };
  
  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sendGridApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailData)
    });
    
    if (response.ok) {
      console.log(`✅ Email sent successfully via SendGrid API to ${to}`);
      return { success: true, messageId: response.headers.get('x-message-id') };
    } else {
      const errorText = await response.text();
      console.error('SendGrid API error:', response.status, errorText);
      throw new Error(`SendGrid API error: ${response.status} - ${errorText}`);
    }
    
  } catch (error) {
    console.error('SendGrid email send failed:', error.message);
    throw error;
  }
}

/**
 * Test function to verify SendGrid API configuration
 */
export async function testSendGridAPI() {
  const sendGridApiKey = process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.FROM_EMAIL || 'dhanyasrikalisamy@gmail.com';
  
  if (!sendGridApiKey) {
    return { success: false, error: 'SENDGRID_API_KEY not set' };
  }
  
  try {
    await sendVerificationEmail(
      fromEmail, // Send to yourself for testing
      'Test User',
      'https://blogspace-app-un4j.onrender.com/api/user/verify?token=test123'
    );
    
    return { success: true, message: 'SendGrid API test successful' };
  } catch (error) {
    return { success: false, error: error.message };
  }
}