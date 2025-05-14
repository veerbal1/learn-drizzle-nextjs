"use client";

import Link from "next/link";
import { format } from "date-fns";

interface PostMetadataProps {
  authorId: number;
  authorName: string;
  publishedDate: Date;
  updatedDate: Date;
  isUpdated: boolean;
  readingTimeMinutes: number;
}

export function PostMetadata({
  authorId,
  authorName,
  publishedDate,
  updatedDate,
  isUpdated,
  readingTimeMinutes,
}: PostMetadataProps) {
  return (
    <div className="flex flex-wrap items-center text-sm text-gray-600 mb-6 gap-x-6 gap-y-2">
      <div className="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
        <Link href={`/posts/user/${authorId}`} className="hover:underline">
          {authorName}
        </Link>
      </div>
      
      <div className="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
        </svg>
        <span title={format(publishedDate, "PPpp")}>
          {format(publishedDate, "MMMM d, yyyy")}
        </span>
      </div>
      
      {isUpdated && (
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          <span title={format(updatedDate, "PPpp")}>
            Updated {format(updatedDate, "MMMM d, yyyy")}
          </span>
        </div>
      )}
      
      <div className="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
        <span>{readingTimeMinutes} min read</span>
      </div>
    </div>
  );
} 