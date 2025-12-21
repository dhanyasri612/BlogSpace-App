import nodemailer from "nodemailer";

export async function GET(request) {
  try {
    console.log('🔧 Testing SMTP connection on production server...');
    
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    
    console.log('📧 SMTP Config:', {
      host: smtpHost,
      port: smtpPort,
      user: smtpUser ? smtpUser.substring(0, 3) + "***" : "not set",
      pass: smtpPass ? "***set***" : "not set"
    });
    
    if (!smtpHost || !smtpUser || !smtpPass) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "SMTP environment variables not set",
          config: {
            host: !!smtpHost,
            user: !!smtpUser,
            pass: !!smtpPass
          }
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort ? Number(smtpPort) : 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: { user: smtpUser, pass: smtpPass },
    });
    
    console.log('🔌 Testing SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection successful');
    
    console.log('📤 Sending test email...');
    const result = await transporter.sendMail({
      from: process.env.FROM_EMAIL || smtpUser,
      to: smtpUser, // Send to yourself
      subject: 'SMTP Test from Production Server',
      html: `
        <h2>SMTP Test Successful</h2>
        <p>This email was sent from your production server to test SMTP configuration.</p>
        <p>Timestamp: ${new Date().toISOString()}</p>
        <p>Server: Render</p>
      `
    });
    
    console.log('✅ Test email sent successfully:', result.messageId);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "SMTP test successful - email sent",
        messageId: result.messageId,
        response: result.response
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error('❌ SMTP test failed:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        code: error.code,
        details: {
          name: error.name,
          errno: error.errno,
          syscall: error.syscall,
          hostname: error.hostname
        }
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}