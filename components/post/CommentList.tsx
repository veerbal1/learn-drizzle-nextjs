"use client";

import Link from "next/link";
import { format } from "date-fns";

interface Comment {
  id: number;
  content: string;
  authorId: number | null;
  authorName: string | null;
  createdAt: Date | string;
}

interface CommentListProps {
  comments: Comment[];
  refreshKey?: number;
}

export function CommentList({ comments }: CommentListProps) {
  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6">Comments ({comments.length})</h2>
      
      {comments.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
          No comments yet. Be the first to comment!
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => {
            const commentAuthorName = comment.authorName || 'Unknown User';
            return (
              <div key={comment.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center">
                      <span className="text-sm font-bold text-white">{commentAuthorName.charAt(0)}</span>
                    </div>
                    <div className="ml-3">
                      <Link 
                        href={`/posts/user/${comment.authorId || 0}`}
                        className="font-medium hover:underline"
                      >
                        {commentAuthorName}
                      </Link>
                      <p className="text-xs text-gray-500">
                        {format(new Date(comment.createdAt), "MMM d, yyyy 'at' h:mm a")}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
} 