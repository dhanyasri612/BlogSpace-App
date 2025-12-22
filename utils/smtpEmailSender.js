import nodemailer from "nodemailer";

export async function sendVerificationEmail(to, username, verifyLink) {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const fromEmail = process.env.FROM_EMAIL || smtpUser;

  console.log("🔧 SMTP Config Check:", {
    host: smtpHost ? "✅ Set" : "❌ Missing",
    port: smtpPort ? "✅ Set" : "❌ Missing", 
    user: smtpUser ? "✅ Set" : "❌ Missing",
    pass: smtpPass ? "✅ Set (length: " + (smtpPass?.length || 0) + ")" : "❌ Missing",
    from: fromEmail ? "✅ Set" : "❌ Missing",
    secure: process.env.SMTP_SECURE
  });

  if (!smtpHost || !smtpUser || !smtpPass) {
    const missingVars = [];
    if (!smtpHost) missingVars.push("SMTP_HOST");
    if (!smtpUser) missingVars.push("SMTP_USER");
    if (!smtpPass) missingVars.push("SMTP_PASS");
    
    throw new Error(
      `SMTP configuration missing: ${missingVars.join(", ")}. Please check your environment variables in production.`
    );
  }

  const transportConfig = {
    host: smtpHost,
    port: smtpPort ? Number(smtpPort) : 587,
    secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
    auth: { 
      user: smtpUser, 
      pass: smtpPass 
    },
    connectionTimeout: 60000, // 60 seconds
    greetingTimeout: 30000,   // 30 seconds
    socketTimeout: 60000,     // 60 seconds
    // Additional settings for better compatibility
    tls: {
      rejectUnauthorized: false
    },
    debug: process.env.NODE_ENV === "development", // Enable debug in dev
    logger: process.env.NODE_ENV === "development" // Enable logging in dev
  };

  console.log("📧 Creating transporter with config:", {
    host: transportConfig.host,
    port: transportConfig.port,
    secure: transportConfig.secure,
    user: transportConfig.auth.user
  });

  const transporter = nodemailer.createTransport(transportConfig);

  // Verify connection before sending
  try {
    console.log("🔍 Verifying SMTP connection...");
    await transporter.verify();
    console.log("✅ SMTP connection verified successfully");
  } catch (verifyError) {
    console.error("❌ SMTP connection verification failed:", verifyError.message);
    throw new Error(`SMTP connection failed: ${verifyError.message}`);
  }

  const mailOptions = {
    from: `"BlogSpace" <${fromEmail}>`,
    to,
    subject: "Please verify your email - BlogSpace",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; text-align: center; margin-bottom: 30px;">Welcome to BlogSpace!</h2>
          <p style="font-size: 16px; color: #555;">Hi <strong>${username}</strong>,</p>
          <p style="font-size: 16px; color: #555; line-height: 1.6;">
            Thanks for registering with BlogSpace! To complete your registration and start sharing your thoughts, 
            please verify your email address by clicking the button below:
          </p>
          <div style="text-align: center; margin: 40px 0;">
            <a href="${verifyLink}" 
               style="background-color: #007bff; color: white; padding: 15px 30px; 
                      text-decoration: none; border-radius: 8px; font-weight: bold;
                      display: inline-block; font-size: 16px;">
              ✅ Verify Email Address
            </a>
          </div>
          <p style="font-size: 14px; color: #666; margin-top: 30px;">
            If the button doesn't work, copy and paste this URL into your browser:
          </p>
          <p style="word-break: break-all; color: #007bff; background-color: #f8f9fa; padding: 10px; border-radius: 5px; font-family: monospace;">
            ${verifyLink}
          </p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            This email was sent from BlogSpace. If you didn't create an account, you can safely ignore this email.
          </p>
        </div>
      </div>
    `,
    text: `
      Welcome to BlogSpace!
      
      Hi ${username},
      
      Thanks for registering! Please verify your email by visiting this link:
      ${verifyLink}
      
      If you didn't create an account, you can ignore this email.
    `
  };

  try {
    console.log(`📤 Sending verification email to: ${to}`);
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ SMTP send success:", { 
      to, 
      messageId: info.messageId,
      response: info.response 
    });
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error("❌ SMTP send failed:", {
      error: err.message,
      code: err.code,
      command: err.command
    });
    throw err;
  }
}

export async function testSmtpSend(to = process.env.SMTP_TEST_TO || "test@example.com") {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const fromEmail = process.env.FROM_EMAIL || smtpUser;

  console.log("🧪 Testing SMTP with config:", {
    host: smtpHost,
    port: smtpPort,
    user: smtpUser,
    testTo: to
  });

  if (!smtpHost || !smtpUser || !smtpPass) {
    return { 
      success: false, 
      error: "SMTP configuration missing. Check SMTP_HOST, SMTP_USER, and SMTP_PASS environment variables." 
    };
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort ? Number(smtpPort) : 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: smtpUser, pass: smtpPass },
    tls: {
      rejectUnauthorized: false
    }
  });

  // Test connection first
  try {
    await transporter.verify();
    console.log("✅ SMTP connection test passed");
  } catch (verifyError) {
    console.error("❌ SMTP connection test failed:", verifyError.message);
    return {
      success: false,
      error: `Connection failed: ${verifyError.message}`
    };
  }

  const mailOptions = {
    from: `"BlogSpace Test" <${fromEmail}>`,
    to,
    subject: "SMTP Test - BlogSpace",
    html: `
      <h2>SMTP Test Successful!</h2>
      <p>This is a test message from BlogSpace.</p>
      <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
      <p><strong>Environment:</strong> ${process.env.NODE_ENV || 'unknown'}</p>
      <p>If you received this email, your SMTP configuration is working correctly!</p>
    `,
    text: `SMTP Test Successful! Test message from BlogSpace at ${new Date().toISOString()}`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Test email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error("❌ Test email failed:", err.message);
    return {
      success: false,
      error: err.message
    };
  }
}