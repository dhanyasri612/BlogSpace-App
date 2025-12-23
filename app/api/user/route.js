import connectMongo from "@/utils/connectMongo";
import userModel from "@/models/userModel.js";
import sendEmail from "@/utils/emailValidator.js";
import { validateEmailQuick } from "@/utils/validation.js";
import crypto from "crypto";

export async function GET(request) {
  return new Response("User GET request received");
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
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Email validation (quick server-side check)
    const emailValidation = await validateEmailQuick(email);
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

    const existing = await userModel.findOne({
      email: email.toLowerCase().trim(),
    });
    if (existing) {
      return new Response(
        JSON.stringify({ message: "Email already registered" }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }
    
    const existingUsername = await userModel.findOne({
      username: username.trim(),
    });
    if (existingUsername) {
      return new Response(
        JSON.stringify({ message: "Username already taken" }),
        { status: 409, headers: { "Content-Type": "application/json" } }
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
    
    let createdUser;
    try {
      createdUser = await userModel.create(user);
    } catch (err) {
      // Handle duplicate key errors gracefully
      if (err && err.code === 11000) {
        const dupField = Object.keys(err.keyPattern || err.keyValue || {})[0] || "field";
        const msg =
          dupField === "email"
            ? "Email already registered"
            : dupField === "username"
            ? "Username already taken"
            : "Duplicate value";
        return new Response(
          JSON.stringify({ message: msg }),
          { status: 409, headers: { "Content-Type": "application/json" } }
        );
      }
      throw err;
    }

    // Send verification email
    const requestOrigin = new URL(request.url).origin;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || requestOrigin;
    const verifyLink = `${baseUrl}/api/user/verify/${createdUser._id}/${verificationToken}`;
    
    const emailSent = await sendEmail(
      user.email,
      "Verify your email address",
      `Welcome to our blog! Please verify your email by clicking the following link: ${verifyLink}`
    );

    if (!emailSent) {
       return new Response(JSON.stringify({ 
         message: "Registration successful, but email sending failed.",
         warning: "Please contact support if you don't receive an email."
       }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ 
      message: "Registration successful. An email has been sent to your account." 
    }), {
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
