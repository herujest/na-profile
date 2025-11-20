import fs from "fs";
import { join } from "path";
import matter from "gray-matter";

const postsDirectory = join(process.cwd(), "app/content/blog");

export function getPostSlugs(): string[] {
  try {
    return fs.readdirSync(postsDirectory);
  } catch (error) {
    // Fallback to _posts if content/blog doesn't exist yet
    const fallbackDir = join(process.cwd(), "_posts");
    if (fs.existsSync(fallbackDir)) {
      return fs.readdirSync(fallbackDir);
    }
    return [];
  }
}

export function getPostBySlug(slug: string, fields: string[] = []): Record<string, any> {
  const realSlug = slug.replace(/\.md$/, "");
  const baseDir = join(process.cwd(), "app/content/blog");
  // Fallback to old locations for backward compatibility
  const fallbackDir = join(process.cwd(), "content/blog");
  const legacyDir = join(process.cwd(), "_posts");
  
  let fullPath = join(baseDir, `${realSlug}.md`);
  if (!fs.existsSync(fullPath)) {
    fullPath = join(fallbackDir, `${realSlug}.md`);
  }
  if (!fs.existsSync(fullPath)) {
    fullPath = join(legacyDir, `${realSlug}.md`);
  }
  
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Post not found: ${realSlug}`);
  }
  
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const items: Record<string, any> = {};

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === "slug") {
      items[field] = realSlug;
    }
    if (field === "content") {
      items[field] = content;
    }

    if (typeof data[field] !== "undefined") {
      items[field] = data[field];
    }
  });

  return items;
}

export function getAllPosts(fields: string[] = []): Record<string, any>[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => {
      try {
        return getPostBySlug(slug, fields);
      } catch (error) {
        return null;
      }
    })
    .filter((post) => post !== null)
    // sort posts by date in descending order
    .sort((post1, post2) => ((post1?.date || "") > (post2?.date || "") ? -1 : 1));
  return posts as Record<string, any>[];
}
