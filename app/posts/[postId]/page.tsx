import Link from "next/link";
import { db } from "@/lib/db";
import { posts, users, comments } from "@/lib/schema";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { PostArticle } from "@/components/post/PostArticle";
import { CommentList } from "@/components/post/CommentList";
import { calculateReadingTime } from "@/lib/utils/post";

interface PostPageProps {
  params: {
    postId: string;
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const postId = parseInt(params.postId);
  
  if (isNaN(postId)) {
    return notFound();
  }
  
  // Fetch the post with author information
  const postResult = await db
    .select({
      id: posts.id,
      title: posts.title,
      content: posts.content,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      authorId: posts.authorId,
      authorName: users.name,
      authorEmail: users.email,
    })
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id))
    .where(eq(posts.id, postId))
    .limit(1);
  
  if (!postResult || postResult.length === 0) {
    return notFound();
  }
  
  const post = postResult[0];
  const authorName = post.authorName || 'Unknown Author';
  
  // Fetch comments for this post
  const postComments = await db
    .select({
      id: comments.id,
      content: comments.content,
      createdAt: comments.createdAt,
      authorId: comments.authorId,
      authorName: users.name,
    })
    .from(comments)
    .leftJoin(users, eq(comments.authorId, users.id))
    .where(eq(comments.postId, postId))
    .orderBy(comments.createdAt);
  
  // Calculate reading time
  const readingTimeMinutes = calculateReadingTime(post.content);
  
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <Link href="/posts" className="text-blue-500 hover:underline mb-2 inline-flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Posts
        </Link>
      </div>
      
      {/* Post Article */}
      <PostArticle 
        post={{
          ...post,
          authorName,
        }}
        readingTimeMinutes={readingTimeMinutes}
      />
      
      {/* Comments Section */}
      <CommentList comments={postComments} />
    </div>
  );
} 