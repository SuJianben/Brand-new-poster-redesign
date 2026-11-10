import type { CSSProperties } from "react";
import { usePoster } from "../state";
import { Icon } from "../Icon";
import { readFooterMenus } from "../footerMenus";
import { FooterMenu } from "./FooterMenu";

type Settings = Record<string, unknown>;
const text = (settings: Settings, key: string, fallback: string) => typeof settings[key] === "string" ? settings[key] as string : fallback;

export function Footer({ settings = {} }: { settings?: Settings }) {
  const { setFilter, setToast } = usePoster();
  const menus = readFooterMenus(typeof settings._blocks === "string" ? settings._blocks : undefined);
  const columns = { "--footer-menu-columns": Math.max(1, menus.length) } as CSSProperties;
  return <footer>
    <div className={`footer-grid ${menus.length === 0 ? "footer-grid-no-menus" : ""}`} style={columns}>
      <div className="footer-info">
        <div className="footer-logo">{text(settings, "logo_text", "ODD WALL")}<span>{text(settings, "logo_accent", "!")}</span></div>
        <p>{text(settings, "description", "Independent art prints for loud minds, blank walls, and people who think a little sideways.")}</p>
        {settings.show_newsletter !== false && <div className="footer-newsletter">
          <span>{text(settings, "newsletter_title", "GOOD STUFF, OCCASIONALLY.")}</span>
          <form onSubmit={(event) => { event.preventDefault(); setToast("You're in. Stay odd!"); }}>
            <input type="email" required placeholder={text(settings, "newsletter_placeholder", "Your email address")} aria-label="Email address" />
            <button aria-label="Subscribe"><Icon name="arrow" /></button>
          </form>
        </div>}
      </div>
      {menus.map((menu) => <FooterMenu key={menu.id} menu={menu} onCategorySelect={setFilter} />)}
    </div>
    <div className="footer-bottom">
      <span>{text(settings, "copyright", "© 2026 ODD WALL STUDIO")}</span>
      <span>{text(settings, "bottom_message", "PRINTED WITH CARE. SHIPPED WORLDWIDE.")}</span>
      <a href={text(settings, "back_url", "#top")}>{text(settings, "back_label", "Back to top ↑")}</a>
    </div>
  </footer>;
}
