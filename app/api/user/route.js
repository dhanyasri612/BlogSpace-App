import connectMongo from "@/utils/connectMongo";
import userModel from "@/models/userModel.js";
import { sendVerificationEmail } from "@/utils/emailSender.js";
import { validateEmail } from "@/utils/emailValidatorProduction.js";

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

    // Send verification email using improved email sender
    let emailSent = false;
    let emailMethod = '';
    
    try {
      const emailResult = await sendVerificationEmail(email, username, verifyLink);
      emailSent = emailResult.success;
      emailMethod = emailResult.method;
      console.log(`✅ Verification email sent via ${emailMethod} to ${email}`);
    } catch (error) {
      console.error('❌ All email sending methods failed:', error.message);
      emailSent = false;
    }

    const responseMessage = emailSent
      ? {
          message:
            "Registration successful. A verification email was sent to your address.",
          verifyLink: process.env.NODE_ENV === 'development' ? verifyLink : undefined,
          emailSent: true,
          emailMethod: emailMethod
        }
      : {
          message:
            "Registration successful, but email delivery failed. Please contact support for manual verification.",
          verifyLink: process.env.NODE_ENV === 'development' ? verifyLink : undefined,
          emailSent: false,
          warning: "Email not sent - check server configuration"
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
