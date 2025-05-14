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
import { createUser, type UserFormState } from "@/app/actions/user";
import { useEffect, useState } from "react";
import { startTransition } from "react";
import { useRouter } from "next/navigation";

// Define the form validation schema
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

// Define the form's type from the schema
type FormValues = z.infer<typeof formSchema>;

// SubmitButton with loading state
function SubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <Button type="submit" className="w-full" disabled={isSubmitting}>
      {isSubmitting ? "Creating..." : "Create User"}
    </Button>
  );
}

export function UserForm() {
  const [state, formAction] = useActionState<UserFormState, FormData>(createUser, {});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  
  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });
  
  // Reset form on successful submission and redirect
  useEffect(() => {
    if (state.success) {
      form.reset();
      setIsSubmitting(false);
      
      // Short timeout to show success message before redirecting
      const redirectTimer = setTimeout(() => {
        router.push('/users');
      }, 100);
      
      return () => clearTimeout(redirectTimer);
    }
    
    if (state.error) {
      setIsSubmitting(false);
    }
  }, [state.success, state.error, form, router]);

  // Handle form submission with react-hook-form
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    // Create FormData for the server action
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    
    // Call the form action inside a startTransition
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Create New User</h2>
      
      {state.success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {state.success} Redirecting to users page...
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your name" {...field} />
                </FormControl>
                <FormDescription>
                  Your full name as it will appear on your account.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email" type="email" {...field} />
                </FormControl>
                <FormDescription>
                  We'll never share your email with anyone else.
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