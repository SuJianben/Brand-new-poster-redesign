import { HeaderNavigation } from "./HeaderNavigation";
import { readHeaderNavigation } from "../headerNavigation";
import { usePoster } from "../state";
import { Icon } from "../Icon";

type Settings = Record<string, string | undefined>;
export function Header({ settings = {} }: { settings?: Settings }) {
  const items = readHeaderNavigation(settings);
  const productPage = document.documentElement.dataset.posterPageType === "product";
  const cartCount = productPage ? Number(document.documentElement.dataset.posterCartCount || 0) : undefined;
  const { searchOpen, setSearchOpen, setCartOpen, cart, closePanels } = usePoster();
  return (<><header className="site-header">
          <a className="logo" href={productPage ? (document.documentElement.dataset.posterHomeUrl || "/") : "#top"} aria-label="Odd Wall home" onClick={closePanels}>
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
              data-cart-drawer-open={productPage ? "" : undefined}
              onClick={() => {
                if (!productPage) setCartOpen(true);
                setSearchOpen(false);
              }}
              aria-label={`Open bag with ${cartCount ?? cart} items`}
            >
              <Icon name="bag" />
              <span>Bag</span>
              <b className={productPage ? "cart-count" : undefined}>{cartCount ?? cart}</b>
            </button>
          </div>
        </header>
        <HeaderNavigation items={items} mobile /></>);
}
