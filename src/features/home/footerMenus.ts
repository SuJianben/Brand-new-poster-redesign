export type FooterLink = { title: string; url: string; fallback?: boolean };
export type FooterMenu = { id: string; heading: string; links: FooterLink[] };

// The local preview uses the same initial content as the Shopify menu blocks.
const defaultMenus: FooterMenu[] = [
  {
    "id": "menu_1",
    "heading": "01 / SHOP",
    "links": [
      {
        "title": "All posters",
        "url": "#shop",
        "fallback": true
      },
      {
        "title": "Philosophy",
        "url": "#shop",
        "fallback": true
      },
      {
        "title": "Satire",
        "url": "#shop",
        "fallback": true
      },
      {
        "title": "Cult icons",
        "url": "#shop",
        "fallback": true
      },
      {
        "title": "New drops",
        "url": "#shop",
        "fallback": true
      }
    ]
  },
  {
    "id": "menu_2",
    "heading": "02 / INFO",
    "links": [
      {
        "title": "Events",
        "url": "#manifesto",
        "fallback": true
      },
      {
        "title": "Print quality",
        "url": "#top",
        "fallback": true
      },
      {
        "title": "Shipping & returns",
        "url": "#top",
        "fallback": true
      },
      {
        "title": "FAQ",
        "url": "#faq",
        "fallback": true
      },
      {
        "title": "About us",
        "url": "#about",
        "fallback": true
      }
    ]
  },
  {
    "id": "menu_3",
    "heading": "03 / FOLLOW",
    "links": [
      {
        "title": "Instagram →",
        "url": "#top",
        "fallback": true
      },
      {
        "title": "TikTok →",
        "url": "#top",
        "fallback": true
      },
      {
        "title": "Pinterest →",
        "url": "#top",
        "fallback": true
      },
      {
        "title": "Spotify →",
        "url": "#top",
        "fallback": true
      }
    ]
  }
];

export function readFooterMenus(raw: string | undefined): FooterMenu[] {
  if (raw === undefined) return defaultMenus;
  try {
    const blocks: unknown = JSON.parse(raw);
    return Array.isArray(blocks) ? blocks : defaultMenus;
  } catch {
    return defaultMenus;
  }
}
