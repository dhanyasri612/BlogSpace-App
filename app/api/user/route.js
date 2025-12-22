import connectMongo from "@/utils/connectMongo";
import userModel from "@/models/userModel.js";
import { sendVerificationEmail } from "@/utils/smtpEmailSender.js";
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
          errors: emailValidation.errors,
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
    const origin = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const verifyLink = `${origin}/api/user/verify?token=${token}`;

    // Send verification email via SMTP (preferred for Gmail) or Resend (fallback)
    let emailSent = false;
    let emailMethod = "";
    
    // Priority 1: Try SMTP first (Best for Gmail/Outlook free sending)
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        console.log("Attempting to send verification email via SMTP...");
        const result = await sendViaSMTP(email, username, verifyLink);
        if (result && result.success) {
          emailSent = true;
          emailMethod = "SMTP";
          console.log("✅ Email sent via SMTP");
        }
      } catch (mailErr) {
        console.error(
          "❌ SMTP send failed:",
          mailErr && mailErr.message ? mailErr.message : mailErr
        );
        // Fall through to Resend if SMTP fails
      }
    }
    
    // Priority 2: Try Resend if SMTP failed or not configured
    if (!emailSent && process.env.RESEND_API_KEY) {
      try {
        console.log("Attempting to send verification email via Resend...");
        const result = await sendViaResend(email, username, verifyLink);
        if (result && result.success) {
          emailSent = true;
          emailMethod = "Resend API";
          console.log("✅ Email sent via Resend API");
        }
      } catch (resendErr) {
        console.error("❌ Resend API failed:", resendErr.message);
      }
    }

    const responseMessage = emailSent
      ? {
          message:
            "Registration successful. A verification email was sent to your address.",
          verifyLink:
            process.env.NODE_ENV === "development" ? verifyLink : undefined,
          emailMethod: emailMethod,
        }
      : {
          message:
            "Registration successful, but email sending failed. Please try again later or contact support.",
          // Only show verify link in development or if explicitly allowed (debugging)
          verifyLink: process.env.NODE_ENV === "development" ? verifyLink : undefined,
          note: "Email delivery failed. Please check your spam folder or contact support."
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
