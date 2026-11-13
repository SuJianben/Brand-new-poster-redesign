import { useEffect, useRef, useState } from "react";
import { usePoster } from "../state";
import { usePredictiveSearch } from "../usePredictiveSearch";
import { Icon } from "../Icon";
import "../search-panel.css";

export function SearchPanel() {
  const { searchOpen, setSearchOpen, search, setSearch, scrolled } = usePoster();
  const root = document.documentElement.dataset.posterHomeUrl || "/";
  const searchUrl = `${root.replace(/\/$/, "")}/search`;
  const { items, status } = usePredictiveSearch(search, searchOpen, root);
  const input = useRef<HTMLInputElement>(null);
  const [headerHeight, setHeaderHeight] = useState(120);
  useEffect(() => {
    const shell = document.querySelector<HTMLElement>("[data-poster-header-shell]");
    if (!shell) { setHeaderHeight(0); return; }
    const update = () => setHeaderHeight(shell.getBoundingClientRect().height);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(shell);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!searchOpen) return;
    input.current?.focus();
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setSearchOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [searchOpen, setSearchOpen]);
  return (
    <div className={`search-panel ${searchOpen ? "is-open" : ""} ${scrolled ? "is-scrolled" : ""}`} aria-hidden={!searchOpen}>
      <button className="search-panel__backdrop" type="button" onClick={() => setSearchOpen(false)} aria-label="Close search" tabIndex={searchOpen ? 0 : -1} />
      <div className="search-panel__sheet" style={{ top: headerHeight, height: `min(50vh, calc(100dvh - ${headerHeight}px))` }}>
        <form className="search-inner" action={searchUrl} method="get" role="search">
          <Icon name="search" />
          <input ref={input} name="q" value={search} onChange={(event) => setSearch(event.target.value)}
            placeholder="Search posters, moods, ideas..." aria-label="Search posters" tabIndex={searchOpen ? 0 : -1} />
          <button type="submit" aria-label="Submit search" tabIndex={searchOpen ? 0 : -1}><Icon name="arrow" /></button>
          <button type="button" onClick={() => setSearchOpen(false)} aria-label="Close search" tabIndex={searchOpen ? 0 : -1}><Icon name="close" /></button>
        </form>
        {search.trim() && (
          <div className="search-results" aria-live="polite">
            {status === "loading" && <p>Searching…</p>}
            {status === "error" && <p>Suggestions are unavailable. Press enter to search.</p>}
            {status === "ready" && items.length === 0 && <p>No suggestions found. Try another search.</p>}
            {items.map((item, index) => (
              <a key={`${item.kind}-${item.url}-${index}`} href={item.url}>
                {item.kind === "product" && item.image ? <img src={item.image} alt="" /> : <span className="search-results__icon" aria-hidden="true"><Icon name="search" /></span>}
                <span><small>{item.kind === "product" ? "PRODUCT" : "SUGGESTED SEARCH"}</small><strong>{item.title}</strong></span>
                <Icon name="arrow" />
              </a>
            ))}
            {status === "ready" && items.length > 0 && <a className="search-results__all" href={`${searchUrl}?q=${encodeURIComponent(search.trim())}`}>View all results <span aria-hidden="true">→</span></a>}
          </div>
        )}
      </div>
    </div>
  );
}
