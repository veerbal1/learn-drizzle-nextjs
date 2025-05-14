"use client";

import Link from "next/link";

interface AuthorInfoProps {
  authorId: number;
  authorName: string;
  authorEmail: string | null;
}

export function AuthorInfo({
  authorId,
  authorName,
  authorEmail,
}: AuthorInfoProps) {
  return (
    <div className="border-t border-gray-200 pt-6 mt-10">
      <div className="flex items-center">
        <div className="flex-shrink-0 bg-gray-300 rounded-full w-12 h-12 flex items-center justify-center">
          <span className="text-xl font-bold text-white">{authorName.charAt(0)}</span>
        </div>
        <div className="ml-4">
          <Link 
            href={`/posts/user/${authorId}`}
            className="text-lg font-semibold hover:underline"
          >
            {authorName}
          </Link>
          <p className="text-gray-600">{authorEmail || 'No email available'}</p>
        </div>
      </div>
    </div>
  );
} 