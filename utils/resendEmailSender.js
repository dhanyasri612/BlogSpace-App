/**
 * Resend Email Sender - Works reliably on hosting platforms
 */

export async function sendVerificationEmail(to, username, verifyLink) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';
  
  console.log('🔍 Resend config check:', {
    apiKeySet: !!resendApiKey,
    fromEmail: fromEmail,
    to: to
  });
  
  if (!resendApiKey) {
    throw new Error('RESEND_API_KEY environment variable not set');
  }
  
  const emailData = {
    from: fromEmail,
    to: [to],
    subject: 'Please verify your email - BlogSpace',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #333; margin: 0;">BlogSpace</h1>
          <p style="color: #666; margin: 5px 0;">Welcome to our community!</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin: 20px 0;">
          <h2 style="color: #333; margin-top: 0;">Hi ${username}! 👋</h2>
          <p style="color: #555; line-height: 1.6;">
            Thanks for joining BlogSpace! To complete your registration and start sharing your thoughts, 
            please verify your email address by clicking the button below.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verifyLink}" 
               style="background: linear-gradient(135deg, #007bff, #0056b3); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 8px; 
                      font-weight: bold;
                      display: inline-block;
                      box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);">
              ✅ Verify Email Address
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-bottom: 0;">
            If the button doesn't work, copy and paste this link into your browser:
          </p>
          <p style="word-break: break-all; color: #007bff; font-size: 14px; margin-top: 5px;">
            ${verifyLink}
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 12px; margin: 0;">
            This email was sent from BlogSpace. If you didn't create an account, you can safely ignore this email.
          </p>
        </div>
      </div>
    `
  };
  
  console.log('📤 Sending email via Resend API...');
  console.log('📧 Email data:', {
    from: emailData.from,
    to: emailData.to,
    subject: emailData.subject
  });
  
  try {
    // Use global fetch or import it if needed
    const fetchFunction = globalThis.fetch || fetch;
    
    if (!fetchFunction) {
      throw new Error('fetch is not available in this environment');
    }
    
    const response = await fetchFunction('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailData)
    });
    
    console.log(`📊 Resend API response status: ${response.status}`);
    
    if (response.ok) {
      const result = await response.json();
      console.log(`✅ Email sent successfully via Resend to ${to}`);
      console.log(`📧 Message ID: ${result.id}`);
      return { success: true, messageId: result.id };
    } else {
      const errorText = await response.text();
      console.error('❌ Resend API error:', response.status, errorText);
      throw new Error(`Resend API error: ${response.status} - ${errorText}`);
    }
    
  } catch (error) {
    console.error('❌ Resend email send failed:', error.message);
    console.error('❌ Full error:', error);
    throw error;
  }
}