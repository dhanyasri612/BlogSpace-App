import connectMongo from "@/utils/connectMongo";
import userModel from "@/models/userModel.js";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get("token");
    if (!token) {
      return new Response(JSON.stringify({ message: "Token is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await connectMongo();
    const user = await userModel.findOne({ verificationToken: token });
    if (!user) {
      return new Response(
        JSON.stringify({ message: "Invalid or expired token" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    return new Response(
      JSON.stringify({ message: "Email verified successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e.message || "Server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
