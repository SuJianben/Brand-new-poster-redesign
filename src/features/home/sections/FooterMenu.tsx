import { useId, useState } from "react";
import { headerHref } from "../headerNavigation";
import { Icon } from "../Icon";
import type { FooterMenu as Menu } from "../footerMenus";

type Props = { menu: Menu; onCategorySelect: (category: string) => void };
const demoCategories: Record<string, string> = { Philosophy: "Philosophy", Satire: "Satire", "Cult icons": "Icons" };

export function FooterMenu({ menu, onCategorySelect }: Props) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  return <nav className="footer-column" aria-label={menu.heading}>
    <span className="footer-column__heading">{menu.heading}</span>
    <button className="footer-column__toggle" type="button" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen(!open)}>
      {menu.heading}<Icon name={open ? "minus" : "plus"} />
    </button>
    <div id={panelId} className={`footer-column__panel${open ? " is-open" : ""}`}>
      <div className="footer-column__links">{menu.links.map((link, index) => <a key={`${index}-${link.url}`} href={link.url === "#top" ? "#top" : headerHref(link.url || "#")}
      onClick={link.fallback && link.url === "#shop" && demoCategories[link.title] ? () => onCategorySelect(demoCategories[link.title]) : undefined}>
      {link.title}
    </a>)}</div>
    </div>
  </nav>;
}
