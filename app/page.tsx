import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">Drizzle NextJS Demo</h1>
      
      <div className="flex flex-col items-center gap-6">
        <p className="text-center max-w-md">
          A simple application demonstrating Drizzle ORM with NextJS and Server Actions.
        </p>
        
        <div className="flex gap-4">
          <Link 
            href="/users/new" 
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
          >
            Create a New User
          </Link>
          
          <Link 
            href="/users" 
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
          >
            View All Users
          </Link>
        </div>
      </div>
    </div>
  );
}
