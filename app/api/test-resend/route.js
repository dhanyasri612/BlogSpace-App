export async function GET(request) {
  try {
    console.log('🧪 Testing Resend API directly...');
    
    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';
    
    if (!resendApiKey) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "RESEND_API_KEY not set"
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    
    console.log('📧 Resend Config:', {
      apiKeyPrefix: resendApiKey.substring(0, 5) + '***',
      fromEmail: fromEmail
    });
    
    const emailData = {
      from: fromEmail,
      to: ['dhanyasrikalisamy@gmail.com'],
      subject: 'Resend API Test - BlogSpace',
      html: `
        <h2>Resend API Test Successful!</h2>
        <p>This email confirms that Resend API is working correctly on your production server.</p>
        <p>Timestamp: ${new Date().toISOString()}</p>
        <p>Server: Render Production</p>
      `
    };
    
    console.log('📤 Sending test email via Resend...');
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailData)
    });
    
    console.log(`📊 Resend API Response Status: ${response.status}`);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Resend API test successful:', result);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Resend API test successful - email sent",
          messageId: result.id,
          status: response.status
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } else {
      const errorText = await response.text();
      console.error('❌ Resend API error:', response.status, errorText);
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Resend API error: ${response.status}`,
          details: errorText,
          debug: {
            apiKeyPrefix: resendApiKey.substring(0, 5) + '***',
            fromEmail: fromEmail
          }
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    
  } catch (error) {
    console.error('❌ Resend test failed:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        name: error.name
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}