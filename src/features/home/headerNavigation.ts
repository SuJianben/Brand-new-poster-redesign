export type NavItem = { title: string; url: string; children: NavItem[] };
type Settings = Record<string, string | undefined>;

export function readHeaderNavigation(settings: Settings): NavItem[] {
  if (settings._menu !== undefined) {
    try {
      const menu: unknown = JSON.parse(settings._menu);
      if (Array.isArray(menu)) return menu as NavItem[];
    } catch { /* retain the existing navigation */ }
  }
  return [
    { title: settings.shop_link_label ?? "Shop all", url: settings.shop_link_url ?? "#shop", children: [
      { title: "All posters", url: "#shop", children: [] },
      { title: "Browse collections", url: "#series", children: [] },
    ] },
    { title: settings.events_link_label ?? "Events", url: settings.events_link_url ?? "#manifesto", children: [] },
    { title: settings.collections_link_label ?? "Collections", url: settings.collections_link_url ?? "#series", children: [
      { title: "Our collections", url: "#series", children: [] },
      { title: "Community", url: "#community", children: [] },
    ] },
    { title: "Journal", url: "#journal", children: [] },
    { title: "About", url: "#about", children: [
      { title: "Our story", url: "#about", children: [] },
      { title: "FAQ", url: "#faq", children: [] },
    ] },
  ];
}
