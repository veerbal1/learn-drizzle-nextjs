import { PostForm } from "@/components/PostForm";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import Link from "next/link";

export const revalidate = 0;

export default async function NewPostPage() {
  // Fetch all users for the author dropdown
  const allUsers = await db.select().from(users).orderBy(users.name);
  
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <Link href="/posts" className="text-blue-500 hover:underline mb-2 inline-flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Posts
        </Link>
        <h1 className="text-3xl font-bold">Create a New Post</h1>
      </div>
      
      <PostForm users={allUsers} />
    </div>
  );
} 