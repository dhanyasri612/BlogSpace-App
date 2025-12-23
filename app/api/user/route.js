import connectMongo from "@/utils/connectMongo";
import userModel from "@/models/userModel.js";
import sendEmail from "@/utils/emailValidator.js";
import { validateEmail } from "@/utils/validation.js";
import crypto from "crypto";

function getCorsHeaders(request) {
  const reqOrigin = request.headers.get("origin");
  const allowedOrigin =
    process.env.CORS_ALLOW_ORIGIN ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    reqOrigin ||
    "*";
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
    "Content-Type": "application/json",
  };
}

export async function OPTIONS(request) {
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(request),
  });
}

export async function GET(request) {
  return new Response("User GET request received", {
    status: 200,
    headers: getCorsHeaders(request),
  });
}

export async function POST(request) {
  try {
    const requestBody = await request.json();
    const { username, email, password } = requestBody;
    
    if (!username || !email || !password) {
      return new Response(
        JSON.stringify({
          message: "username, email and password are required",
        }),
        { status: 400, headers: getCorsHeaders(request) }
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
        { status: 400, headers: getCorsHeaders(request) }
      );
    }

    await connectMongo();

    const existing = await userModel.findOne({
      email: email.toLowerCase().trim(),
    });
    if (existing) {
      return new Response(
        JSON.stringify({ message: "Email already registered" }),
        { status: 409, headers: getCorsHeaders(request) }
      );
    }

    // Create verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = {
      username,
      email: email.toLowerCase().trim(),
      password,
      isVerified: false,
      verificationToken: verificationToken
    };
    
    const createdUser = await userModel.create(user);

    // Send verification email
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const verifyLink = `${baseUrl}/api/user/verify/${createdUser._id}/${verificationToken}`;
    
    const emailResult = await sendEmail(
      user.email,
      "Verify your email address",
      `Welcome to our blog! Please verify your email by clicking the following link: ${verifyLink}`
    );

    if (!emailResult.success) {
       return new Response(JSON.stringify({ 
         message: "Registration successful, but email sending failed.",
         warning: "Please contact support if you don't receive an email.",
         error: emailResult.error,
         code: emailResult.code
       }), {
        status: 201,
        headers: getCorsHeaders(request),
      });
    }

    return new Response(JSON.stringify({ 
      message: "Registration successful. An email has been sent to your account." 
    }), {
      status: 201,
      headers: getCorsHeaders(request),
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e.message || e._message || "Server error" }),
      { status: 500, headers: getCorsHeaders(request) }
    );
  }
}
