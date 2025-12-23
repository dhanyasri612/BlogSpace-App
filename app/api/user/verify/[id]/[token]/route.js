import connectMongo from "@/utils/connectMongo";
import userModel from "@/models/userModel.js";

export async function GET(_request, { params }) {
  try {
    const { id, token } = await params;

    await connectMongo();
    const user = await userModel.findOne({ _id: id, verificationToken: token });
    if (!user) {
      return new Response(JSON.stringify({ message: "Invalid link" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    return new Response(
      JSON.stringify({ message: "Email verified successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch {
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
