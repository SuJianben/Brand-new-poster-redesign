import { headerHref } from "../headerNavigation";
import { useEffect, useState, type RefObject } from "react";
import type { NavItem } from "../headerNavigation";
import { Icon } from "../Icon";

type Props = { item: NavItem; onNavigate: () => void; onEnter: () => void; onLeave: () => void; id: string; panelRef: RefObject<HTMLDivElement | null> };

export function HeaderMegaMenu({ item, onNavigate, onEnter, onLeave, id, panelRef }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => setActiveIndex(0), [item.title, item.url]);
  const selected = item.children[activeIndex] ?? item.children[0];
  if (!selected) return null;
  return <div ref={panelRef} className="header-mega" id={id} onMouseEnter={onEnter} onMouseLeave={onLeave}>
    <div className="header-mega-brand">
      <span>ODD WALL / {item.title}</span>
      <strong>ART FOR<br />LOUD MINDS<span>!</span></strong>
      <a href={headerHref(item.url)} onClick={onNavigate}>EXPLORE {item.title} <Icon name="arrow" /></a>
    </div>
    <div className="header-mega-categories" aria-label={`${item.title} categories`}>
      {item.children.map((child, index) => {
        const image = child.image || child.products?.[0]?.image;
        return <a key={`${index}-${child.url}`} href={headerHref(child.url)} className={index === activeIndex ? "is-active" : ""}
          onMouseEnter={() => setActiveIndex(index)} onFocus={() => setActiveIndex(index)} onClick={onNavigate}>
          {image ? <img src={image} alt="" /> : <span className="header-mega-number">{String(index + 1).padStart(2, "0")}</span>}
          <span>{child.title}</span><Icon name="arrow" />
        </a>;
      })}
    </div>
    <div className="header-mega-content">
      <div className="header-mega-title"><span>{selected.title}</span><span>ODD WALL / EXPLORE</span></div>
      {selected.products && selected.products.length > 0 && <div className="header-mega-products">
        {selected.products.slice(0, 4).map((product, index) => <a href={headerHref(product.url)} key={`${index}-${product.url}`} onClick={onNavigate}>
          <div className="header-mega-image" style={product.color ? { backgroundColor: product.color } : undefined}>
            <img src={product.image} alt="" loading="lazy" />
          </div>
          <span>{product.title}</span>
        </a>)}
      </div>}
      {selected.children?.length > 0 && <ul className="header-mega-links">{selected.children.map((child, index) =>
        <li key={`${index}-${child.url}`}><a href={headerHref(child.url)} onClick={onNavigate}>{child.title} <Icon name="arrow" /></a></li>
      )}</ul>}
      <a className="header-mega-more" href={headerHref(selected.url)} onClick={onNavigate}>VIEW {selected.title} <Icon name="arrow" /></a>
    </div>
  </div>;
}
