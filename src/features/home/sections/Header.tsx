import { usePoster } from "../state";
import { Icon } from "../Icon";

type Settings = Record<string, string | undefined>;
export function Header({ settings = {} }: { settings?: Settings }) {
  const { setFilter, searchOpen, setSearchOpen, setCartOpen, search, setSearch, scrolled, cart, searchResults, closePanels } = usePoster();
  return (
    <>
      <div className={`top-shell ${scrolled ? "is-scrolled" : ""}`}>
        <div className="announcement">
          <span>{settings.announcement ?? "FREE WORLDWIDE SHIPPING OVER $75"}</span>
          <span className="announcement-center">{settings.announcement_center ?? "NEW DROP: THINKING IS A STREET SPORT"}</span>
          <a href="#shop">SHOP THE DROP →</a>
        </div>
        <header className="site-header">
          <a className="logo" href="#top" aria-label="Odd Wall home" onClick={closePanels}>
            <span>ODD</span>WALL<span className="logo-dot">!</span>
          </a>
          <nav className="desktop-nav" aria-label="Main navigation">
            <a href={settings.shop_link_url ?? "#shop"}>{settings.shop_link_label ?? "Shop all"}</a>
            <a href={settings.events_link_url ?? "#manifesto"}>{settings.events_link_label ?? "Events"}</a>
            <a href={settings.collections_link_url ?? "#series"}>{settings.collections_link_label ?? "Collections"}</a>
          </nav>
          <div className="header-actions">
            <button
              className="icon-button search-button"
              onClick={() => {
                setSearchOpen(!searchOpen);
                setCartOpen(false);
              }}
              aria-label="Search"
            >
              <Icon name="search" />
            </button>
            <button
              className="bag-button"
              onClick={() => {
                setCartOpen(true);
                setSearchOpen(false);
              }}
              aria-label={`Open bag with ${cart} items`}
            >
              <Icon name="bag" />
              <span>Bag</span>
              <b>{cart}</b>
            </button>
          </div>
        </header>
        <nav className="mobile-link-bar" aria-label="Mobile navigation">
          <a href={settings.shop_link_url ?? "#shop"}>{settings.shop_link_label ?? "Shop all"}</a>
          <a href={settings.events_link_url ?? "#manifesto"}>{settings.events_link_label ?? "Events"}</a>
          <a href={settings.collections_link_url ?? "#series"}>{settings.collections_link_label ?? "Collections"}</a>
        </nav>
      </div>

      <div className={`search-panel ${searchOpen ? "is-open" : ""}`} aria-hidden={!searchOpen}>
        <div className="search-inner">
          <Icon name="search" />
          <input
            autoFocus={searchOpen}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search posters, moods, ideas..."
            aria-label="Search posters"
          />
          <button onClick={() => setSearchOpen(false)} aria-label="Close search">
            <Icon name="close" />
          </button>
        </div>
        {search && (
          <div className="search-results">
            <span>{searchResults.length} RESULTS</span>
            {searchResults.slice(0, 4).map((product) => (
              <a
                key={product.id}
                href="#shop"
                onClick={() => {
                  setFilter(product.type);
                  setSearchOpen(false);
                }}
              >
                <img src={product.image} alt="" />
                <div>
                  <small>{product.type}</small>
                  <strong>{product.name}</strong>
                </div>
                <b>${product.price}</b>
              </a>
            ))}
            {!searchResults.length && <p>No posters found. Try something a little stranger.</p>}
          </div>
        )}
      </div>
    </>
  );
}
