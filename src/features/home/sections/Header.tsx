import { usePoster } from "../state";
import { Icon } from "../Icon";

type Settings = Record<string, string | undefined>;
export function Header({ settings = {} }: { settings?: Settings }) {
  const { searchOpen, setSearchOpen, setCartOpen, cart, closePanels } = usePoster();
  return (<><header className="site-header">
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
        </nav></>);
}
