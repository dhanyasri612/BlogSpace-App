import { testSendGridAPI } from "@/utils/sendGridEmailSender.js";

export async function GET(request) {
  try {
    console.log('🧪 Testing SendGrid HTTP API...');
    
    const sendGridApiKey = process.env.SENDGRID_API_KEY;
    const fromEmail = process.env.FROM_EMAIL || 'dhanyasrikalisamy@gmail.com';
    
    console.log('📧 SendGrid Config Check:', {
      apiKeySet: !!sendGridApiKey,
      apiKeyPrefix: sendGridApiKey ? sendGridApiKey.substring(0, 5) + '***' : 'not set',
      fromEmail: fromEmail
    });
    
    if (!sendGridApiKey) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "SENDGRID_API_KEY environment variable not set",
          debug: {
            envVars: Object.keys(process.env).filter(key => key.includes('SENDGRID'))
          }
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // Test SendGrid API directly
    const emailData = {
      personalizations: [
        {
          to: [{ email: fromEmail }],
          subject: 'SendGrid API Test - BlogSpace'
        }
      ],
      from: { email: fromEmail },
      content: [
        {
          type: 'text/html',
          value: `
            <h2>SendGrid API Test Successful!</h2>
            <p>This email confirms that SendGrid HTTP API is working correctly.</p>
            <p>Timestamp: ${new Date().toISOString()}</p>
            <p>Server: Render Production</p>
          `
        }
      ]
    };
    
    console.log('📤 Sending test email via SendGrid HTTP API...');
    
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sendGridApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailData)
    });
    
    console.log(`📊 SendGrid API Response Status: ${response.status}`);
    
    if (response.ok) {
      const messageId = response.headers.get('x-message-id');
      console.log('✅ SendGrid API test successful');
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "SendGrid HTTP API test successful - email sent",
          messageId: messageId,
          status: response.status
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } else {
      const errorText = await response.text();
      console.error('❌ SendGrid API error:', response.status, errorText);
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `SendGrid API error: ${response.status}`,
          details: errorText,
          debug: {
            apiKeyPrefix: sendGridApiKey.substring(0, 5) + '***',
            fromEmail: fromEmail
          }
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    
  } catch (error) {
    console.error('❌ SendGrid test failed:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        name: error.name,
        stack: error.stack?.split('\n').slice(0, 3) // First 3 lines of stack trace
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}