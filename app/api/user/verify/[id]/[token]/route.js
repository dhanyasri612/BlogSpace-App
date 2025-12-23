import connectMongo from "@/utils/connectMongo";
import userModel from "@/models/userModel.js";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { id, token } = await params;

    await connectMongo();
    const user = await userModel.findOne({ _id: id, verificationToken: token });
    
    if (!user) {
      return NextResponse.redirect(new URL('/login?verified=false&error=Invalid+or+expired+link', request.url));
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    return NextResponse.redirect(new URL('/login?verified=true', request.url));
  } catch (error) {
    return NextResponse.redirect(new URL('/login?verified=false&error=Server+error', request.url));
  }
}
