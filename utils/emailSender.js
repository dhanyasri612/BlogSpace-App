import nodemailer from "nodemailer";
import { sendVerificationEmail as sendViaSendGridAPI } from "./sendGridEmailSender.js";

/**
 * Unified email sender that tries multiple methods
 * 1. SendGrid HTTP API (most reliable for hosting platforms)
 * 2. SMTP (fallback)
 */
export async function sendVerificationEmail(email, username, verifyLink) {
  console.log(`📧 Attempting to send verification email to ${email}`);
  
  // Method 1: Try SendGrid HTTP API first (most reliable)
  if (process.env.SENDGRID_API_KEY) {
    try {
      console.log('🚀 Trying SendGrid HTTP API...');
      const result = await sendViaSendGridAPI(email, username, verifyLink);
      console.log('✅ Email sent successfully via SendGrid API');
      return { success: true, method: 'SendGrid API', messageId: result.messageId };
    } catch (error) {
      console.error('❌ SendGrid API failed:', error.message);
      // Continue to SMTP fallback
    }
  }
  
  // Method 2: Try SMTP (fallback)
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const fromEmail = process.env.FROM_EMAIL || `no-reply@blogspace-app.com`;
  
  if (smtpHost && smtpUser && smtpPass) {
    try {
      console.log('📤 Trying SMTP...');
      
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort ? Number(smtpPort) : 587,
        secure: process.env.SMTP_SECURE === "true",
        auth: { user: smtpUser, pass: smtpPass },
      });
      
      // Test connection first
      await transporter.verify();
      
      const mailOptions = {
        from: fromEmail,
        to: email,
        subject: "Please verify your email - BlogSpace",
        html: `
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
        `,
      };
      
      const result = await transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully via SMTP');
      return { success: true, method: 'SMTP', messageId: result.messageId };
      
    } catch (error) {
      console.error('❌ SMTP failed:', error.message);
      throw new Error(`All email methods failed. Last error: ${error.message}`);
    }
  }
  
  throw new Error('No email configuration available (neither SendGrid API key nor SMTP settings)');
}