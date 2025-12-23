import connectMongo from "@/utils/connectMongo";
import userModel from "@/models/userModel.js";

function getCorsHeaders(request) {
  const reqOrigin = request.headers.get("origin");
  const allowedOrigin =
    process.env.CORS_ALLOW_ORIGIN ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    reqOrigin ||
    "*";
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
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

export async function POST(req) {
  try {
    const { username, password } = await req.json();
    await connectMongo();
    const user = await userModel.findOne({ username });
    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
        headers: getCorsHeaders(req),
      });
    }
    if (!user.isVerified) {
      return new Response(JSON.stringify({ message: "Please verify your email first" }), {
        status: 400,
        headers: getCorsHeaders(req),
      });
    }
    if (user.password !== password) {
      return new Response(JSON.stringify({ message: "Invalid password" }), {
        status: 401,
        headers: getCorsHeaders(req),
      });
    }
    // Return user object without password
    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
    };
    return new Response(
      JSON.stringify({ message: "Login successful", user: userResponse }),
      {
        status: 200,
        headers: getCorsHeaders(req),
      }
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: e._message }), {
      status: 500,
      headers: getCorsHeaders(req),
    });
  }
}
