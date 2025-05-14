import Link from "next/link";
import { db } from "@/lib/db";
import { users, posts } from "@/lib/schema";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";

interface UserPostsPageProps {
  params: {
    userId: string;
  };
}

export default async function UserPostsPage({ params }: UserPostsPageProps) {
  const userId = parseInt(params.userId);
  
  if (isNaN(userId)) {
    return notFound();
  }
  
  // Fetch the user
  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  
  if (!user || user.length === 0) {
    return notFound();
  }
  
  // Fetch posts by the user
  const userPosts = await db.select().from(posts).where(eq(posts.authorId, userId)).orderBy(posts.createdAt);
  
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link href="/users" className="text-blue-500 hover:underline mb-2 inline-flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Users
          </Link>
          <h1 className="text-3xl font-bold">Posts by {user[0].name}</h1>
          <p className="text-gray-600">{user[0].email}</p>
        </div>
        
        <Link 
          href="/posts/new"
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
        >
          Create Post
        </Link>
      </div>
      
      {userPosts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No posts found for this user.</p>
          <p className="mt-2">
            <Link href="/posts/new" className="text-blue-500 hover:underline">
              Create a new post
            </Link>
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {userPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>
                    {format(new Date(post.createdAt), "MMM d, yyyy")}
                  </span>
                  <Link 
                    href={`/posts/${post.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    Read more
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