import nodemailer from "nodemailer";

export async function GET(request) {
  try {
    console.log('🔍 Starting Deep SMTP Debug...');
    
    // 1. Check Environment Variables
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpSecure = process.env.SMTP_SECURE;

    const envStatus = {
      SMTP_HOST: smtpHost || 'MISSING',
      SMTP_PORT: smtpPort || 'MISSING',
      SMTP_USER: smtpUser ? `${smtpUser.substring(0, 3)}***` : 'MISSING',
      SMTP_PASS: smtpPass ? `Present (${smtpPass.length} chars)` : 'MISSING',
      SMTP_SECURE: smtpSecure || 'MISSING (Defaults to false)'
    };

    console.log('📋 Environment Config:', envStatus);

    if (!smtpHost || !smtpUser || !smtpPass) {
      return new Response(JSON.stringify({
        success: false,
        message: "Missing required environment variables",
        envStatus
      }), { status: 500 });
    }

    // 2. Create Transporter
    const transportConfig = {
      host: smtpHost,
      port: Number(smtpPort) || 587,
      secure: smtpSecure === 'true', // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      debug: true, // Enable debug logs
      logger: true // Log to console
    };

    console.log('🛠 Transporter Config:', {
      host: transportConfig.host,
      port: transportConfig.port,
      secure: transportConfig.secure,
      auth_user: transportConfig.auth.user
    });

    const transporter = nodemailer.createTransport(transportConfig);

    // 3. Verify Connection
    console.log('🔌 Verifying SMTP Connection...');
    await transporter.verify();
    console.log('✅ Connection Verified!');

    // 4. Send Test Email
    console.log('📨 Sending Test Email...');
    const info = await transporter.sendMail({
      from: `"Debug Test" <${smtpUser}>`,
      to: smtpUser, // Send to self
      subject: "SMTP Debug Test - Render",
      text: "If you receive this, SMTP is working correctly on Render!",
      html: "<b>If you receive this, SMTP is working correctly on Render!</b>"
    });

    console.log('✅ Email Sent:', info.messageId);

    return new Response(JSON.stringify({
      success: true,
      message: "SMTP is working correctly!",
      details: {
        messageId: info.messageId,
        response: info.response,
        envelope: info.envelope
      }
    }), { status: 200 });

  } catch (error) {
    console.error('❌ SMTP Error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: "SMTP Failed",
      error: error.message,
      stack: error.stack,
      code: error.code,
      command: error.command
    }), { status: 500 });
  }
}