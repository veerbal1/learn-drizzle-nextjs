"use client";

import { PostMetadata } from "./PostMetadata";
import { PostContent } from "./PostContent";
import { AuthorInfo } from "./AuthorInfo";

interface PostArticleProps {
  post: {
    id: number;
    title: string;
    content: string;
    authorId: number | null;
    authorName: string;
    authorEmail: string | null;
    createdAt: string | Date;
    updatedAt: string | Date;
  };
  readingTimeMinutes: number;
}

export function PostArticle({ post, readingTimeMinutes }: PostArticleProps) {
  // Format dates
  const publishedDate = new Date(post.createdAt);
  const updatedDate = new Date(post.updatedAt);
  const isUpdated = publishedDate.getTime() !== updatedDate.getTime();
  
  return (
    <article className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-8">
        {/* Post Header */}
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        
        {/* Post Metadata */}
        <PostMetadata
          authorId={post.authorId || 0}
          authorName={post.authorName}
          publishedDate={publishedDate}
          updatedDate={updatedDate}
          isUpdated={isUpdated}
          readingTimeMinutes={readingTimeMinutes}
        />
        
        {/* Post Content */}
        <PostContent content={post.content} />
        
        {/* Author Info */}
        <AuthorInfo
          authorId={post.authorId || 0}
          authorName={post.authorName}
          authorEmail={post.authorEmail}
        />
      </div>
    </article>
  );
} 