export async function GET(request) {
  try {
    console.log('🔍 Checking email configuration...');
    
    const resendApiKey = process.env.RESEND_API_KEY;
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    
    const config = {
      resend: {
        configured: !!resendApiKey,
        keyPrefix: resendApiKey ? resendApiKey.substring(0, 5) + '***' : 'not set'
      },
      smtp: {
        configured: !!(smtpHost && smtpUser && smtpPass),
        host: smtpHost || 'not set',
        user: smtpUser ? smtpUser.substring(0, 3) + '***' : 'not set'
      },
      environment: process.env.NODE_ENV || 'development'
    };
    
    console.log('📧 Email Config:', config);
    
    return new Response(
      JSON.stringify({ 
        success: true,
        config: config,
        recommendation: resendApiKey 
          ? "Resend API key found - emails should work"
          : "Add RESEND_API_KEY environment variable for production emails"
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error('❌ Config check failed:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}