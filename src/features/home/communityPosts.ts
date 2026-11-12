import { socialPosts } from "./data";

export type CommunityProduct = { id: number; title: string; url: string; price: string; price_varies: boolean; image: string | null };
export type CommunityPost = (typeof socialPosts)[number] & { id?: string; link_url?: string; products: CommunityProduct[] };
type CommunityBlock = { id: string; settings: Partial<CommunityPost>; image: string | null; products?: CommunityProduct[] };

export function readCommunityPosts(settings: Record<string, string | undefined>): CommunityPost[] {
  if (settings._blocks === undefined) return socialPosts.slice(0, 5).map((post) => ({ ...post, products: [] }));
  try {
    const blocks = JSON.parse(settings._blocks) as CommunityBlock[];
    return blocks.slice(0, 5).map(({ id, settings: post, image, products }) => ({
      id,
      image: image || post.image || "",
      alt: post.alt || "",
      handle: post.handle || "",
      credit: post.credit || "",
      link_url: post.link_url || "",
      products: products || [],
    }));
  } catch {
    return socialPosts.slice(0, 5).map((post) => ({ ...post, products: [] }));
  }
}
