import { usePoster } from "../state";
import { Icon } from "../Icon";

type Settings = Record<string, string | undefined>;
export function Footer({ settings = {} }: { settings?: Settings }) {
  const { setFilter, setToast } = usePoster();
  return (
    <>
      <footer>
        <div className="footer-grid">
          <div className="footer-info">
            <div className="footer-logo">
              ODD WALL<span>!</span>
            </div>
            <p>
              {settings.description ?? "Independent art prints for loud minds, blank walls, and people who think a little sideways."}
            </p>
            <div className="footer-newsletter">
              <span>GOOD STUFF, OCCASIONALLY.</span>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setToast("You're in. Stay odd!");
                }}
              >
                <input
                  type="email"
                  required
                  placeholder="Your email address"
                  aria-label="Email address"
                />
                <button aria-label="Subscribe">
                  <Icon name="arrow" />
                </button>
              </form>
            </div>
          </div>
          <nav className="footer-column" aria-label="Shop">
            <span>01 / SHOP</span>
            <a href="#shop">All posters</a>
            <a href="#shop" onClick={() => setFilter("Philosophy")}>
              Philosophy
            </a>
            <a href="#shop" onClick={() => setFilter("Satire")}>
              Satire
            </a>
            <a href="#shop" onClick={() => setFilter("Icons")}>
              Cult icons
            </a>
            <a href="#shop">New drops</a>
          </nav>
          <nav className="footer-column" aria-label="Information">
            <span>02 / INFO</span>
            <a href="#manifesto">Events</a>
            <a href="#top">Print quality</a>
            <a href="#top">Shipping & returns</a>
            <a href="#faq">FAQ</a>
            <a href="#about">About us</a>
          </nav>
          <nav className="footer-column" aria-label="Social media">
            <span>03 / FOLLOW</span>
            <a href="#top">Instagram →</a>
            <a href="#top">TikTok →</a>
            <a href="#top">Pinterest →</a>
            <a href="#top">Spotify →</a>
          </nav>
        </div>
        <div className="footer-bottom">
          <span>© 2026 ODD WALL STUDIO</span>
          <span>PRINTED WITH CARE. SHIPPED WORLDWIDE.</span>
          <a href="#top">Back to top ↑</a>
        </div>
      </footer>
    </>
  );
}
