import Link from "next/link";
import { db } from "@/lib/db";
import { posts, users } from "@/lib/schema";
import { format } from "date-fns";
import { eq } from "drizzle-orm";

export default async function PostsPage() {
  // Fetch all posts with author information
  const allPosts = await db
    .select({
      id: posts.id,
      title: posts.title,
      content: posts.content,
      createdAt: posts.createdAt,
      authorId: posts.authorId,
      authorName: users.name,
    })
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id))
    .orderBy(posts.createdAt);
  
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">All Posts</h1>
        <Link 
          href="/posts/new" 
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
        >
          Create New Post
        </Link>
      </div>
      
      {allPosts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No posts found.</p>
          <p className="mt-2">
            <Link href="/posts/new" className="text-blue-500 hover:underline">
              Create your first post
            </Link>
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {allPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>
                    {format(new Date(post.createdAt), "MMM d, yyyy")}
                  </span>
                  <Link
                    href={`/users/${post.authorId}`}
                    className="text-blue-500 hover:underline"
                  >
                    By {post.authorName}
                  </Link>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
                  <Link 
                    href={`/posts/${post.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    Read more
                  </Link>
                  <Link 
                    href={`/posts/user/${post.authorId}`}
                    className="text-purple-500 hover:underline"
                  >
                    More from this author
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 