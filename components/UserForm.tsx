"use client";

import { useFormState, useFormStatus } from "react-dom";
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
import { useEffect } from "react";

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

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Creating..." : "Create User"}
    </Button>
  );
}

export function UserForm() {
  const [state, formAction] = useFormState<UserFormState, FormData>(createUser, {});
  
  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });
  
  // Reset form on successful submission
  useEffect(() => {
    if (state.success) {
      form.reset();
    }
  }, [state.success, form]);

  // Create a client action that passes React Hook Form values to the server action
  const clientAction = async (data: FormValues) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formAction(formData);
  };

  return (
    <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Create New User</h2>
      
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
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(clientAction)} className="space-y-6">
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
          
          <SubmitButton />
        </form>
      </Form>
    </div>
  );
} 