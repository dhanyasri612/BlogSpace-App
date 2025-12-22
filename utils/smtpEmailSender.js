import nodemailer from "nodemailer";

export async function sendVerificationEmail(to, username, verifyLink) {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const fromEmail =
    process.env.FROM_EMAIL ||
    `no-reply@${
      new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000")
        .hostname
    }`;

  if (!smtpHost || !smtpUser || !smtpPass) {
    throw new Error(
      "SMTP configuration missing (SMTP_HOST/SMTP_USER/SMTP_PASS)"
    );
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort ? Number(smtpPort) : 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: smtpUser, pass: smtpPass },
    connectionTimeout: 10000,
    greetingTimeout: 5000,
    socketTimeout: 10000,
  });

  const mailOptions = {
    from: fromEmail,
    to,
    subject: "Please verify your email - BlogSpace",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Welcome to BlogSpace!</h2>
        <p>Hi ${username},</p>
        <p>Thanks for registering with BlogSpace! Please click the button below to verify your email address:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verifyLink}" 
             style="background-color: #007bff; color: white; padding: 15px 30px; 
                    text-decoration: none; border-radius: 8px; font-weight: bold;
                    display: inline-block;">
            Verify Email Address
          </a>
        </div>
        <p>If the button doesn't work, copy and paste this URL into your browser:</p>
        <p style="word-break: break-all; color: #007bff;">${verifyLink}</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">This email was sent from BlogSpace. If you didn't create an account, you can safely ignore this email.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ SMTP send success:", { to, messageId: info.messageId });
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(
      "❌ SMTP send failed:",
      err && err.message ? err.message : err
    );
    throw err;
  }
}

export async function testSmtpSend(to = process.env.SMTP_TEST_TO) {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const fromEmail =
    process.env.FROM_EMAIL ||
    `no-reply@${
      new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000")
        .hostname
    }`;

  if (!smtpHost || !smtpUser || !smtpPass) {
    return { success: false, error: "SMTP configuration missing" };
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort ? Number(smtpPort) : 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: smtpUser, pass: smtpPass },
  });

  const mailOptions = {
    from: fromEmail,
    to,
    subject: "SMTP Test - BlogSpace",
    text: `Test message from BlogSpace at ${new Date().toISOString()}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    return {
      success: false,
      error: err && err.message ? err.message : String(err),
    };
  }
}
