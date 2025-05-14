"use client";

import { useActionState } from "react";
import { useState, useRef, useEffect } from "react";
import { startTransition } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createComment, type CommentFormState } from "@/app/actions/comment";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback } from "@/components/ui/avatar";

interface CommentFormProps {
  postId: number;
  users: {
    id: number;
    name: string;
  }[];
  onCommentAdded?: () => void;
}

export function CommentForm({ postId, users, onCommentAdded }: CommentFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState<CommentFormState, FormData>(createComment, {});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState<number | null>(null);
  const [comment, setComment] = useState("");

  // Reset form and show success/error messages on submission completion
  useEffect(() => {
    if (state.success) {
      setComment("");
      setIsSubmitting(false);
      if (onCommentAdded) {
        onCommentAdded();
      }

      // Clear success message after 3 seconds
      const timeout = setTimeout(() => {
        formAction({ success: undefined, error: undefined } as any);
      }, 3000);
      
      return () => clearTimeout(timeout);
    }
    
    if (state.error) {
      setIsSubmitting(false);
    }
  }, [state, formAction, onCommentAdded]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAuthor || !comment.trim()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Create FormData for the server action
    const formData = new FormData();
    formData.append("content", comment);
    formData.append("postId", postId.toString());
    formData.append("authorId", selectedAuthor.toString());
    
    // Call the form action inside a startTransition
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Leave a Comment</h2>
      
      {state.success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {state.success}
        </div>
      )}
      
      {state.error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {state.error}
        </div>
      )}
      
      <form ref={formRef} onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Comment as:
          </label>
          <div className="flex flex-wrap gap-2">
            {users.map((user) => (
              <Button
                key={user.id}
                type="button"
                variant={selectedAuthor === user.id ? "default" : "outline"}
                onClick={() => setSelectedAuthor(user.id)}
                className="flex items-center gap-2"
              >
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span>{user.name}</span>
              </Button>
            ))}
          </div>
          {users.length === 0 && (
            <p className="text-sm text-yellow-600 mt-1">
              No users available. Create a user first to comment.
            </p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="comment">
            Your Comment:
          </label>
          <Textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your comment here..."
            className="resize-y min-h-24"
            disabled={isSubmitting || !selectedAuthor}
          />
        </div>
        
        <Button
          type="submit"
          disabled={isSubmitting || !selectedAuthor || !comment.trim()}
          className="w-full"
        >
          {isSubmitting ? "Submitting..." : "Submit Comment"}
        </Button>
      </form>
    </div>
  );
} 