import connectMongo from "@/utils/connectMongo";
import userModel from "@/models/userModel.js";
import nodemailer from "nodemailer";
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

    // Send verification email - simplified approach
    let emailSent = false;
    let emailMethod = '';
    
    // For now, let's just use SMTP with better error handling
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const fromEmail = process.env.FROM_EMAIL || `no-reply@${new URL(origin).hostname}`;

    if (smtpHost && smtpUser && smtpPass) {
      try {
        console.log('📧 Trying SMTP email delivery...');
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort ? Number(smtpPort) : 587,
          secure: process.env.SMTP_SECURE === "true",
          auth: { user: smtpUser, pass: smtpPass },
          // Add timeout and connection options for better reliability
          connectionTimeout: 10000,
          greetingTimeout: 5000,
          socketTimeout: 10000,
        });

        const mailOptions = {
          from: fromEmail,
          to: email,
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
              <p style="color: #666; font-size: 12px;">
                This email was sent from BlogSpace. If you didn't create an account, you can safely ignore this email.
              </p>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
        emailSent = true;
        emailMethod = 'SMTP';
        console.log(`✅ Email sent via SMTP to ${email}`);
      } catch (mailErr) {
        console.error("SMTP send failed:", mailErr.message);
        emailSent = false;
      }
    } else {
      console.error("SMTP configuration missing");
      emailSent = false;
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
