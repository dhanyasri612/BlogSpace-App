import connectMongo from "@/utils/connectMongo";
import userModel from "@/models/userModel.js";
import sendEmail from "@/utils/emailValidator.js";
import { validateEmail } from "@/utils/validation.js";

export const runtime = "nodejs";

// CORS headers for cross-origin requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS(request) {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function GET(request) {
  return new Response("User GET request received", {
    headers: { ...corsHeaders, "Content-Type": "text/plain" },
  });
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
        { 
          status: 400, 
          headers: { 
            ...corsHeaders,
            "Content-Type": "application/json" 
          } 
        }
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
        { 
          status: 400, 
          headers: { 
            ...corsHeaders,
            "Content-Type": "application/json" 
          } 
        }
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
        { 
          status: 409, 
          headers: { 
            ...corsHeaders,
            "Content-Type": "application/json" 
          } 
        }
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
    const verifyLink = `${origin}/api/user/verify/${created._id}/${token}`;

    let emailSent = false;
    try {
      emailSent = await sendEmail(
        email,
        "Verify your email address",
        `Welcome to our blog! Please verify your email by clicking the following link: ${verifyLink}`
      );
    } catch (mailErr) {
      console.error(
        "SMTP send failed:",
        mailErr && mailErr.message ? mailErr.message : mailErr
      );
      emailSent = false;
    }

    const responseMessage = emailSent
      ? {
          message:
            "Registration successful. A verification email was sent to your address.",
          verifyLink:
            process.env.NODE_ENV === "development" ? verifyLink : undefined,
        }
      : {
          message:
            "Registration successful! Please use this link to verify your email:",
          verifyLink: verifyLink,
          note: "Email delivery is temporarily unavailable. Please bookmark this verification link."
        };

    return new Response(JSON.stringify(responseMessage), {
      status: 201,
      headers: { 
        ...corsHeaders,
        "Content-Type": "application/json" 
      },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e.message || e._message || "Server error" }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" 
        } 
      }
    );
  }
}
