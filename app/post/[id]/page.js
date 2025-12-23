import connectMongo from "../../../utils/connectMongo";
import PostModel from "../../../models/postModel";
import "../../../models/userModel";
import PostActions from "../../../components/PostActions";

export const runtime = "nodejs";

export default async function PostPage({ params }) {
  const { id } = await params; // Add await here for Next.js 15+

  let post = null;
  try {
    await connectMongo();
    console.log("Fetching post with ID:", id);
    post = await PostModel.findOne({ _id: id }).populate('user', 'username email');
    console.log("Post found:", post ? "Yes" : "No");
  } catch (error) {
    console.error("Error fetching post:", error);
    post = null;
  }
  return (
    <div className="mt-3 mx-2">
      {!post && (
        <div className="p-5 text-center">
          <h3>Post not found</h3>
        </div>
      )}
      {post && (
        <div
          style={{ background: "rgba(255, 255, 255, 1)" }}
          className="p-3 border-1 mr-2 border rounded"
        >
          <img
            src={post.image}
            alt={post.title}
            className=" mt-5"
            style={{ height: "55%", width: "500px" ,display:"block",margin:"auto"}}
          />
          <h1 className="mt-3 text-center">{post.title}</h1>
          {post.user && (
            <p className="mt-2 text-center">
              <strong>Author:</strong> {post.user.username || post.user.email}
            </p>
          )}
          <h4 className="mt-2 text-center" >
            <i className="text-muted text-white">{post.created_at_formatted}</i>
          </h4>
          
          {/* Edit/Delete buttons - only visible to author */}
          <PostActions postId={post._id.toString()} authorId={post.user?._id?.toString() || post.user?.toString()} />
          
          <p
            className="text-justify p-2 card mt-5"
            style={{
              whiteSpace: "pre-line",
              background: "rgba(241, 241, 241, 1)",
            }}
          >
            {post.description}
          </p>
        </div>
      )}
      <br />
    </div>
  );
}
