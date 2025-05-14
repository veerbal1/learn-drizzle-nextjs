"use client";

import { useActionState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { startTransition } from "react";
import { useRouter } from "next/navigation";
import { createPost, type PostFormState } from "@/app/actions/post";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define the form validation schema
const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  content: z.string().min(10, {
    message: "Content must be at least 10 characters.",
  }),
  authorId: z.string({
    required_error: "Please select an author.",
  }),
});

// Define the form's type from the schema
type FormValues = z.infer<typeof formSchema>;

interface User {
  id: number;
  name: string;
  email: string;
}

// SubmitButton with loading state
function SubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <Button type="submit" className="w-full" disabled={isSubmitting}>
      {isSubmitting ? "Creating..." : "Create Post"}
    </Button>
  );
}

export function PostForm({ users }: { users: User[] }) {
  const [state, formAction] = useActionState<PostFormState, FormData>(createPost, {});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  
  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      authorId: "",
    },
  });
  
  // Reset form on successful submission and redirect
  useEffect(() => {
    if (state.success) {
      form.reset();
      setIsSubmitting(false);
      
      // Short timeout to show success message before redirecting
      const redirectTimer = setTimeout(() => {
        router.push('/posts');
      }, 100);
      
      return () => clearTimeout(redirectTimer);
    }
    
    if (state.error) {
      setIsSubmitting(false);
    }
  }, [state.success, state.error, form, router]);

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    // Create FormData for the server action
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("authorId", data.authorId);
    
    // Call the form action inside a startTransition
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <div className="max-w-2xl w-full mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Create New Post</h2>
      
      {state.success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {state.success} Redirecting to posts page...
        </div>
      )}
      
      {state.error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {state.error}
        </div>
      )}
      
      <Form {...form}>
        <form 
          onSubmit={form.handleSubmit(onSubmit)} 
          className="space-y-6"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter post title" {...field} />
                </FormControl>
                <FormDescription>
                  A descriptive title for your post.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Write your post content here..." 
                    className="min-h-32 resize-y"
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  The main content of your post.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="authorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an author" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the author of this post.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <SubmitButton isSubmitting={isSubmitting} />
        </form>
      </Form>
    </div>
  );
} 