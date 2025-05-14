"use client";

interface PostContentProps {
  content: string;
}

export function PostContent({ content }: PostContentProps) {
  return (
    <div className="prose prose-lg max-w-none mb-10">
      {content.split("\n").map((paragraph, index) => (
        paragraph.trim() ? <p key={index}>{paragraph}</p> : <br key={index} />
      ))}
    </div>
  );
} 