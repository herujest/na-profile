/**
 * Helper function to normalize image source URL
 */
export function getImageSrc(src: string): string {
  // If it's already a full URL (http/https), use it directly
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }
  // If it's a relative path starting with /, use it directly
  if (src.startsWith("/")) {
    return src;
  }
  // Otherwise, treat it as a relative path and prepend /images/
  return `/images/${src}`;
}

