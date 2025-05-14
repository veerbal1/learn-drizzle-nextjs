import { db } from "@/lib/db";
import { posts, users, comments } from "@/lib/schema";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { ClientPostPage } from "@/components/post/ClientPostPage";
import { calculateReadingTime } from "@/lib/utils/post";

interface PostPageProps {
  params: {
    postId: string;
  };
}

export default async function PostPage(props: any) {
  // Ensure params is properly awaited by using Promise.resolve
  const resolvedParams = await props.params;
  const postId = parseInt(resolvedParams.postId);
  
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
    
  // Fetch all users for the comment form
  const allUsers = await db
    .select({
      id: users.id,
      name: users.name,
    })
    .from(users)
    .orderBy(users.name);
  
  // Calculate reading time
  const readingTimeMinutes = calculateReadingTime(post.content);
  
  return (
    <ClientPostPage
      post={{
        ...post,
        authorName,
      }}
      comments={postComments}
      users={allUsers}
      readingTimeMinutes={readingTimeMinutes}
    />
  );
} 