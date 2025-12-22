import connectMongo from "@/utils/connectMongo";
import userModel from "@/models/userModel.js";
import nodemailer from "nodemailer";
import { sendVerificationEmail as sendViaResend } from "@/utils/resendEmailSender.js";
import { validateEmail } from "@/utils/emailValidator.js";

export async function GET(request) {
  return new Response("User GET request received");
}

export async function POST(request) {
  try {
    const requestBody = await request.json();
    const { username, email, password } = requestBody;
    // Basic required fields check
    if (!username || !email || !password) {
      return new Response(
        JSON.stringify({
          message: "username, email and password are required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Enhanced email validation
    const emailValidation = await validateEmail(email);
    if (!emailValidation.isValid) {
      return new Response(
        JSON.stringify({ 
          message: "Invalid email address", 
          errors: emailValidation.errors 
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    await connectMongo();

    // Check for existing email
    const existing = await userModel.findOne({
      email: email.toLowerCase().trim(),
    });
    if (existing) {
      return new Response(
        JSON.stringify({ message: "Email already registered" }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }

    // create a verification token (simple random string)
    const token = Math.random().toString(36).slice(2) + Date.now().toString(36);
    const user = {
      username,
      email: email.toLowerCase().trim(),
      password,
      verificationToken: token,
      isVerified: false,
    };
    const created = await userModel.create(user);

    // Build a verification link for testing / manual email delivery
    const origin =
      process.env.NEXT_PUBLIC_BASE_URL ||
      "http://localhost:3000";
    const verifyLink = `${origin}/api/user/verify?token=${token}`;

    // Send verification email - try Resend first, then SMTP fallback
    let emailSent = false;
    let emailMethod = '';
    
    // Method 1: Try Resend API (works on hosting platforms)
    if (process.env.RESEND_API_KEY) {
      try {
        console.log('📧 Trying Resend API...');
        await sendViaResend(email, username, verifyLink);
        emailSent = true;
        emailMethod = 'Resend API';
        console.log(`✅ Email sent via Resend to ${email}`);
      } catch (error) {
        console.error('❌ Resend failed:', error.message);
        // Continue to SMTP fallback
      }
    }
    
    // Method 2: SMTP fallback (for localhost)
    if (!emailSent) {
      const smtpHost = process.env.SMTP_HOST;
      const smtpPort = process.env.SMTP_PORT;
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASS;
      const fromEmail = process.env.FROM_EMAIL || `no-reply@${new URL(origin).hostname}`;

      if (smtpHost && smtpUser && smtpPass) {
        try {
          console.log('📧 Trying SMTP...');
          const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort ? Number(smtpPort) : 587,
            secure: process.env.SMTP_SECURE === "true",
            auth: { user: smtpUser, pass: smtpPass },
          });

          const mailOptions = {
            from: fromEmail,
            to: email,
            subject: "Please verify your email - BlogSpace",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Welcome to BlogSpace!</h2>
                <p>Hi ${username},</p>
                <p>Thanks for registering. Click the link below to verify your email address:</p>
                <p><a href="${verifyLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a></p>
                <p>If the button doesn't work, copy and paste this URL into your browser:</p>
                <p>${verifyLink}</p>
              </div>
            `,
          };

          await transporter.sendMail(mailOptions);
          emailSent = true;
          emailMethod = 'SMTP';
          console.log(`✅ Email sent via SMTP to ${email}`);
        } catch (mailErr) {
          console.error("SMTP send failed:", mailErr.message);
        }
      }
    }

    const responseMessage = emailSent
      ? {
          message: "Registration successful. A verification email was sent to your address.",
          verifyLink: process.env.NODE_ENV === 'development' ? verifyLink : undefined,
          emailMethod: emailMethod
        }
      : {
          message: "Registration successful, but email delivery failed. Please contact support for manual verification.",
          verifyLink: process.env.NODE_ENV === 'development' ? verifyLink : undefined
        };
    
    return new Response(JSON.stringify(responseMessage), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e.message || e._message || "Server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
