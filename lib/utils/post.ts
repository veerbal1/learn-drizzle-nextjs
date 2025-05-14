/**
 * Calculate the estimated reading time for a given text.
 * Assumes an average reading speed of 200 words per minute.
 * 
 * @param content The text content to calculate reading time for
 * @returns The estimated reading time in minutes
 */
export function calculateReadingTime(content: string): number {
  const wordCount = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 200));
} 