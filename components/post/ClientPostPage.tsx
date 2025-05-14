"use client";

import { useState } from "react";
import { PostArticle } from "./PostArticle";
import { CommentList } from "./CommentList";
import { CommentForm } from "./CommentForm";
import Link from "next/link";

interface User {
  id: number;
  name: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  authorId: number | null;
  authorName: string;
  authorEmail: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

interface Comment {
  id: number;
  content: string;
  authorId: number | null;
  authorName: string | null;
  createdAt: Date | string;
}

interface ClientPostPageProps {
  post: Post;
  comments: Comment[];
  users: User[];
  readingTimeMinutes: number;
}

export function ClientPostPage({ post, comments, users, readingTimeMinutes }: ClientPostPageProps) {
  const [refreshKey, setRefreshKey] = useState(0);
  
  const handleCommentAdded = () => {
    // When a comment is added, trigger a refresh by incrementing the key
    setRefreshKey(prev => prev + 1);
  };
  
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
        post={post}
        readingTimeMinutes={readingTimeMinutes}
      />
      
      {/* Comments Section */}
      <CommentList 
        comments={comments} 
        refreshKey={refreshKey}
      />
      
      {/* Comment Form */}
      <CommentForm 
        postId={post.id} 
        users={users} 
        onCommentAdded={handleCommentAdded}
      />
    </div>
  );
} 