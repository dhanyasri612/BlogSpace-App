import connectMongo from "@/utils/connectMongo";
import userModel from "@/models/userModel.js";
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

    // Create user without email verification
    const user = {
      username,
      email: email.toLowerCase().trim(),
      password,
      isVerified: true,
    };
    const created = await userModel.create(user);

    const responseMessage = {
      message: "Registration successful.",
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
