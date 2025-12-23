import connectMongo from "../../../utils/connectMongo";
import PostModel from "../../../models/postModel";
import "../../../models/userModel";
import { NextResponse } from "next/server";
import cloudinary from "../../../utils/cloudinary";

export const runtime = "nodejs";

// CORS headers
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

const uploadToCloudinary = (fileBuffer, folder = "nextjs_blog") =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });

export async function GET(req) {
  const query = req.nextUrl.searchParams.get("q");
  const userId = req.nextUrl.searchParams.get("userId");

  try {
    await connectMongo();

    const findQuery = {};

    if (query) {
      findQuery.$or = [
        { title: new RegExp(query, "i") },
        { description: new RegExp(query, "i") },
      ];
    }

    if (userId) {
      // Only this user's posts
      findQuery.user = userId;
    }

    const postData = await PostModel.find(findQuery)
      .populate({
        path: "user",
        select: "username email",
        strictPopulate: false,
      })
      .sort({ created_at: -1 });

    // Convert to plain objects with virtuals
    const posts = postData.map((post) => {
      const postObj = post.toObject({ virtuals: true });
      if (!postObj.short_description && postObj.description) {
        postObj.short_description =
          postObj.description.substring(0, 200) + "...";
      }
      if (!postObj.created_at_formatted && postObj.created_at) {
        const date = new Date(postObj.created_at);
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        postObj.created_at_formatted = `${date.getDate()} ${
          months[date.getMonth()]
        } ${date.getFullYear()}`;
      }
      return postObj;
    });

    return NextResponse.json(posts, {
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      { error: error.message },
      { 
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}

export async function POST(req) {
  try {
    await connectMongo();
    const data = await req.formData();
    const title = data.get("title");
    const content = data.get("content");
    const image = data.get("image");
    const author = data.get("author");

    if (!title || !content || !author) {
      return NextResponse.json(
        { error: "Title, content, and author are required" },
        { 
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    let imageUrl = "";

    if (image && image.size > 0) {
      const buffer = Buffer.from(await image.arrayBuffer());
      imageUrl = await uploadToCloudinary(buffer);
    }

    const newPost = await PostModel.create({
      title,
      description: content,
      image: imageUrl,
      user: author,
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, post: newPost }, {
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: error.message },
      { 
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}
