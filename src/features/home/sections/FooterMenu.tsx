import type { FooterMenu as Menu } from "../footerMenus";

type Props = { menu: Menu; onCategorySelect: (category: string) => void };
const demoCategories: Record<string, string> = { Philosophy: "Philosophy", Satire: "Satire", "Cult icons": "Icons" };

export function FooterMenu({ menu, onCategorySelect }: Props) {
  return <nav className="footer-column" aria-label={menu.heading}>
    <span>{menu.heading}</span>
    {menu.links.map((link, index) => <a key={`${index}-${link.url}`} href={link.url || "#"}
      onClick={link.fallback && link.url === "#shop" && demoCategories[link.title] ? () => onCategorySelect(demoCategories[link.title]) : undefined}>
      {link.title}
    </a>)}
  </nav>;
}
