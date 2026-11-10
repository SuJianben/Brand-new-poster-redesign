import { useEffect, useRef, useState } from "react";
import type { NavItem } from "../headerNavigation";
import { HeaderMegaMenu } from "./HeaderMegaMenu";

type Props = { items: NavItem[]; mobile?: boolean };

function Submenu({ items, onNavigate }: { items: NavItem[]; onNavigate: () => void }) {
  return <ul className="header-submenu-list">{items.map((item, index) => <li key={`${index}-${item.url}`}>
    <a href={item.url} onClick={onNavigate}>{item.title}</a>
    {item.children?.length > 0 && <ul className="header-submenu-nested">{item.children.map((child, childIndex) =>
      <li key={`${childIndex}-${child.url}`}><a href={child.url} onClick={onNavigate}>{child.title}</a></li>
    )}</ul>}
  </li>)}</ul>;
}

export function HeaderNavigation({ items, mobile = false }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const cancelClose = () => window.clearTimeout(closeTimer.current);
  const scheduleClose = () => { cancelClose(); closeTimer.current = window.setTimeout(() => setOpenIndex(null), 350); };
  useEffect(() => () => window.clearTimeout(closeTimer.current), []);
  useEffect(() => {
    if (openIndex === null) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!navRef.current?.contains(target) && !panelRef.current?.contains(target)) setOpenIndex(null);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenIndex(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openIndex]);
  const active = openIndex === null ? undefined : items[openIndex];
  const close = () => setOpenIndex(null);
  return <>
    <nav ref={navRef} className={mobile ? "mobile-link-bar" : "desktop-nav"} aria-label={mobile ? "Mobile navigation" : "Main navigation"}
      onMouseLeave={mobile ? undefined : scheduleClose} onMouseEnter={mobile ? undefined : cancelClose} onKeyDown={(event) => { if (event.key === "Escape") { close(); (event.target as HTMLElement).blur(); } }}>
      {items.map((item, index) => {
        const expanded = openIndex === index && item.children?.length > 0;
        const id = `${mobile ? "mobile" : "desktop"}-submenu-${index}`;
        return <div className="header-nav-item" key={`${index}-${item.url}`}
          onMouseEnter={mobile ? undefined : () => setOpenIndex(item.children?.length ? index : null)}>
          <a href={item.url} onClick={close}>{item.title}</a>
          {item.children?.length > 0 && <button type="button" className="header-nav-toggle" aria-expanded={expanded} aria-controls={id}
            aria-label={`${expanded ? "Close" : "Open"} ${item.title} menu`} onClick={() => setOpenIndex(expanded ? null : index)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
          </button>}
        </div>;
      })}
    </nav>
    {!mobile && active && <HeaderMegaMenu panelRef={panelRef} item={active} id={`desktop-submenu-${openIndex}`}
      onEnter={cancelClose} onLeave={scheduleClose} onNavigate={close} />}
    {mobile && active && <div ref={panelRef} className="header-mobile-submenu" id={`mobile-submenu-${openIndex}`}>
      <Submenu items={active.children} onNavigate={close} />
    </div>}
  </>;
}
