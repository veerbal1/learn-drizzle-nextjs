"use server";

import { db } from "@/lib/db";
import { comments } from "@/lib/schema";
import * as z from "zod";
import { revalidatePath } from "next/cache";

// Define the comment creation schema
const commentCreateSchema = z.object({
  content: z.string().min(1, {
    message: "Comment cannot be empty.",
  }).max(1000, {
    message: "Comment must be less than 1000 characters."
  }),
  postId: z.string().min(1, {
    message: "Post ID is required.",
  }),
  authorId: z.string().min(1, {
    message: "Author ID is required.",
  }),
});

export type CommentFormState = {
  success?: string;
  error?: string;
  data?: any;
};

export async function createComment(prevState: CommentFormState, formData: FormData): Promise<CommentFormState> {
  try {
    // Extract and validate the form data
    const content = formData.get("content") as string;
    const postId = formData.get("postId") as string;
    const authorId = formData.get("authorId") as string;
    
    const validatedData = commentCreateSchema.parse({ content, postId, authorId });
    
    // Insert the comment into the database
    const newComment = await db.insert(comments).values({
      content: validatedData.content,
      postId: parseInt(validatedData.postId),
      authorId: parseInt(validatedData.authorId),
    }).returning();
    
    // Revalidate the post page to reflect the changes
    revalidatePath(`/posts/${validatedData.postId}`);
    
    // Return success response
    return {
      success: "Comment submitted successfully!",
      data: newComment[0]
    };
  } catch (error) {
    console.error("Error creating comment:", error);
    
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return {
        error: error.errors.map(err => `${err.path}: ${err.message}`).join(", ")
      };
    }
    
    // Handle other errors
    return {
      error: "Failed to submit comment. Please try again."
    };
  }
} 