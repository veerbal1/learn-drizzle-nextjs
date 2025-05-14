"use server";

import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import * as z from "zod";
import { revalidatePath } from "next/cache";

// Define the user creation schema
const userCreateSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

export type UserFormState = {
  success?: string;
  error?: string;
  data?: any;
};

export async function createUser(prevState: UserFormState, formData: FormData): Promise<UserFormState> {
  try {
    // Extract and validate the form data
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    
    const validatedData = userCreateSchema.parse({ name, email });
    
    // Insert the user into the database
    const newUser = await db.insert(users).values({
      name: validatedData.name,
      email: validatedData.email,
    }).returning();
    
    // Revalidate the users page to reflect the changes
    revalidatePath("/users");
    
    // Return success response
    return {
      success: "User created successfully!",
      data: newUser[0]
    };
  } catch (error) {
    console.error("Error creating user:", error);
    
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return {
        error: error.errors.map(err => `${err.path}: ${err.message}`).join(", ")
      };
    }
    
    // Handle other errors
    return {
      error: "Failed to create user. Please try again."
    };
  }
} 