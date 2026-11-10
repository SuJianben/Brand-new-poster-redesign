import { HeaderNavigation } from "./HeaderNavigation";
import { readHeaderNavigation } from "../headerNavigation";
import { usePoster } from "../state";
import { Icon } from "../Icon";

type Settings = Record<string, string | undefined>;
export function Header({ settings = {} }: { settings?: Settings }) {
  const items = readHeaderNavigation(settings);
  const { searchOpen, setSearchOpen, setCartOpen, cart, closePanels } = usePoster();
  return (<><header className="site-header">
          <a className="logo" href="#top" aria-label="Odd Wall home" onClick={closePanels}>
            <span>ODD</span>WALL<span className="logo-dot">!</span>
          </a>
          <HeaderNavigation items={items} />
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
        <HeaderNavigation items={items} mobile /></>);
}
