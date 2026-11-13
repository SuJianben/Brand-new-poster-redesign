import { useEffect, useRef } from "react";
import { headerHref, type NavItem } from "../headerNavigation";
import "../mobile-menu.css";

function MenuItems({ items, onNavigate, nested = false }: { items: NavItem[]; onNavigate: () => void; nested?: boolean }) {
  return <ul className={nested ? "mobile-menu__children" : "mobile-menu__list"}>
    {items.map((item, index) => <li className="mobile-menu__item" key={`${index}-${item.url}`}>
      {item.children?.length ? <details>
        <summary><span>{item.title}</span><span className="mobile-menu__plus" aria-hidden="true">+</span></summary>
        <div className="mobile-menu__subnav">
          <a className="mobile-menu__all" href={headerHref(item.url)} onClick={onNavigate}>View all {item.title} <span aria-hidden="true">→</span></a>
          <MenuItems items={item.children} onNavigate={onNavigate} nested />
        </div>
      </details> : <a href={headerHref(item.url)} onClick={onNavigate}>{item.title}<span aria-hidden="true">↗</span></a>}
    </li>)}
  </ul>;
}

export function MobileMenu({ items, open, onClose }: { items: NavItem[]; open: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { onClose(); document.querySelector<HTMLButtonElement>(".mobile-menu-toggle")?.focus(); }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>("a[href], button, summary"));
      const visible = focusable.filter((element) => element.getClientRects().length > 0);
      if (!visible.length) return;
      if (event.shiftKey && document.activeElement === visible[0]) { event.preventDefault(); visible[visible.length - 1].focus(); }
      else if (!event.shiftKey && document.activeElement === visible[visible.length - 1]) { event.preventDefault(); visible[0].focus(); }
    };
    const media = window.matchMedia("(min-width: 601px)");
    const onResize = () => { if (media.matches) onClose(); };
    document.addEventListener("keydown", onKeyDown);
    media.addEventListener("change", onResize);
    return () => { document.removeEventListener("keydown", onKeyDown); media.removeEventListener("change", onResize); };
  }, [open, onClose]);
  return <div id="mobile-menu" className={`mobile-menu ${open ? "is-open" : ""}`} aria-hidden={!open} inert={!open}>
    <button className="mobile-menu__backdrop" type="button" aria-label="Close menu" onClick={onClose} tabIndex={-1} />
    <aside ref={panelRef} className="mobile-menu__panel" role="dialog" aria-modal="true" aria-label="Menu">
      <div className="mobile-menu__heading"><span>MENU<span className="mobile-menu__dot">.</span></span><button ref={closeRef} type="button" onClick={() => { onClose(); document.querySelector<HTMLButtonElement>(".mobile-menu-toggle")?.focus(); }} aria-label="Close menu">×</button></div>
      <nav aria-label="Mobile navigation"><MenuItems items={items} onNavigate={onClose} /></nav>
    </aside>
  </div>;
}
