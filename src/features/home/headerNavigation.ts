import { products } from "./data";
export type MenuPreview = { title: string; url: string; image: string; color?: string };
export type NavItem = { title: string; url: string; children: NavItem[]; image?: string | null; products?: MenuPreview[] };

const demoPreviews: MenuPreview[] = products.map((product) => ({
  title: product.name, url: "#shop", image: product.image, color: product.color,
}));
type Settings = Record<string, string | undefined>;

export function readHeaderNavigation(settings: Settings): NavItem[] {
  if (settings._menu !== undefined) {
    try {
      const menu: unknown = JSON.parse(settings._menu);
      if (Array.isArray(menu)) return menu as NavItem[];
    } catch { /* retain the existing navigation */ }
  }
  return [
    { title: settings.shop_link_label ?? "Shop all", url: settings.shop_link_url || "#shop", children: [
      { title: "All posters", url: settings.all_posters_url || "#shop", children: [], products: demoPreviews.slice(0, 4) },
      { title: "Browse collections", url: settings.browse_collections_url || "#series", children: [], products: demoPreviews.slice(2, 6) },
    ] },
    { title: settings.events_link_label ?? "Events", url: settings.events_link_url || "#manifesto", children: [] },
    { title: settings.collections_link_label ?? "Collections", url: settings.collections_link_url || "#series", children: [
      { title: "Our collections", url: settings.our_collections_url || "#series", children: [], products: demoPreviews.slice(1, 5) },
      { title: "Community", url: settings.community_url || "#community", children: [] },
    ] },
    { title: "Journal", url: settings.journal_link_url || "#journal", children: [] },
    { title: "About", url: settings.about_link_url || "#about", children: [
      { title: "Our story", url: settings.our_story_url || "#about", children: [] },
      { title: "FAQ", url: settings.faq_url || "#faq", children: [] },
    ] },
  ];
}

// Homepage anchors need the locale-aware home URL outside the homepage.
export function headerHref(url: string): string {
  const page = document.documentElement.dataset.posterPageType;
  if ((page === "product" || page === "cart" || page === "collection" || page === "page") && url.startsWith("#")) {
    return `${document.documentElement.dataset.posterHomeUrl || "/"}${url}`;
  }
  return url;
}
