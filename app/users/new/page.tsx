import { UserForm } from "@/components/UserForm";

export default function NewUserPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">User Registration</h1>
      <UserForm />
    </div>
  );
} 