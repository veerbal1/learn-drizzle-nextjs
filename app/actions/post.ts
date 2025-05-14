"use server";

import { db } from "@/lib/db";
import { posts } from "@/lib/schema";
import * as z from "zod";
import { revalidatePath } from "next/cache";

// Define the post creation schema
const postCreateSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  content: z.string().min(10, {
    message: "Content must be at least 10 characters.",
  }),
  authorId: z.string().min(1, {
    message: "Author is required.",
  }),
});

export type PostFormState = {
  success?: string;
  error?: string;
  data?: any;
};

export async function createPost(prevState: PostFormState, formData: FormData): Promise<PostFormState> {
  try {
    // Extract and validate the form data
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const authorId = formData.get("authorId") as string;
    
    const validatedData = postCreateSchema.parse({ title, content, authorId });
    
    // Insert the post into the database
    const newPost = await db.insert(posts).values({
      title: validatedData.title,
      content: validatedData.content,
      authorId: parseInt(validatedData.authorId),
    }).returning();
    
    // Revalidate the posts page to reflect the changes
    revalidatePath("/posts");
    revalidatePath(`/posts/user/${validatedData.authorId}`);
    
    // Return success response
    return {
      success: "Post created successfully!",
      data: newPost[0]
    };
  } catch (error) {
    console.error("Error creating post:", error);
    
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return {
        error: error.errors.map(err => `${err.path}: ${err.message}`).join(", ")
      };
    }
    
    // Handle other errors
    return {
      error: "Failed to create post. Please try again."
    };
  }
} 