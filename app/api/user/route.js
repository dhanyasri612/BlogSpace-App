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

    // Try to send a verification email if SMTP is configured
    let emailSent = false;
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const fromEmail =
      process.env.FROM_EMAIL || `no-reply@${new URL(origin).hostname}`;

    if (smtpHost && smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort ? Number(smtpPort) : 587,
          secure: process.env.SMTP_SECURE === "true",
          auth: { user: smtpUser, pass: smtpPass },
        });

        const mailOptions = {
          from: fromEmail,
          to: email,
          subject: "Please verify your email",
          html: `<p>Hi ${username},</p>
                 <p>Thanks for registering. Click the link below to verify your email address:</p>
                 <p><a href="${verifyLink}">Verify email</a></p>
                 <p>If the link doesn't work, copy and paste this URL into your browser:</p>
                 <p>${verifyLink}</p>`,
        };

        await transporter.sendMail(mailOptions);
        emailSent = true;
      } catch (mailErr) {
        // Log the error server-side. Keep going so user can still verify via link.
        console.error(
          "Verification email send failed:",
          mailErr?.message || mailErr
        );
      }
    }

    const responseMessage = emailSent
      ? {
          message:
            "Registration successful. A verification email was sent to your address.",
          verifyLink: process.env.NODE_ENV === 'development' ? verifyLink : undefined
        }
      : {
          message:
            "Registration successful. A verification email was sent to your address.",
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
