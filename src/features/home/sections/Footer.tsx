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
            <a href={settings.all_posters_url ?? "#shop"}>{settings.all_posters_label ?? "All posters"}</a>
            <a href={settings.philosophy_url ?? "#shop"} onClick={() => setFilter("Philosophy")}>
              {settings.philosophy_label ?? "Philosophy"}
            </a>
            <a href={settings.satire_url ?? "#shop"} onClick={() => setFilter("Satire")}>
              {settings.satire_label ?? "Satire"}
            </a>
            <a href={settings.cult_icons_url ?? "#shop"} onClick={() => setFilter("Icons")}>
              {settings.cult_icons_label ?? "Cult icons"}
            </a>
            <a href={settings.new_drops_url ?? "#shop"}>{settings.new_drops_label ?? "New drops"}</a>
          </nav>
          <nav className="footer-column" aria-label="Information">
            <span>02 / INFO</span>
            <a href={settings.events_url ?? "#manifesto"}>{settings.events_label ?? "Events"}</a>
            <a href={settings.quality_url ?? "#top"}>{settings.quality_label ?? "Print quality"}</a>
            <a href={settings.shipping_url ?? "#top"}>{settings.shipping_label ?? "Shipping & returns"}</a>
            <a href={settings.faq_url ?? "#faq"}>{settings.faq_label ?? "FAQ"}</a>
            <a href={settings.about_url ?? "#about"}>{settings.about_label ?? "About us"}</a>
          </nav>
          <nav className="footer-column" aria-label="Social media">
            <span>03 / FOLLOW</span>
            <a href={settings.instagram_url ?? "#top"}>{settings.instagram_label ?? "Instagram →"}</a>
            <a href={settings.tiktok_url ?? "#top"}>{settings.tiktok_label ?? "TikTok →"}</a>
            <a href={settings.pinterest_url ?? "#top"}>{settings.pinterest_label ?? "Pinterest →"}</a>
            <a href={settings.spotify_url ?? "#top"}>{settings.spotify_label ?? "Spotify →"}</a>
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
