import { usePoster } from "../state";
import { Icon } from "../Icon";

export function SearchPanel() {
  const { searchOpen, setSearchOpen, search, setSearch, scrolled } = usePoster();
  const root = document.documentElement.dataset.posterHomeUrl || "/";
  const searchUrl = `${root.replace(/\/$/, "")}/search`;
  return (
    <div className={`search-panel ${searchOpen ? "is-open" : ""} ${scrolled ? "is-scrolled" : ""}`} aria-hidden={!searchOpen}>
      <form className="search-inner" action={searchUrl} method="get" role="search">
        <Icon name="search" />
        <input autoFocus={searchOpen} name="q" value={search} onChange={(event) => setSearch(event.target.value)}
          placeholder="Search posters, moods, ideas..." aria-label="Search posters" />
        <button type="submit" aria-label="Submit search"><Icon name="arrow" /></button>
        <button type="button" onClick={() => setSearchOpen(false)} aria-label="Close search"><Icon name="close" /></button>
      </form>
    </div>
  );
}
