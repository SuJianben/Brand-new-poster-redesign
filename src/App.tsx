import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { PosterContext, usePosterState } from "./features/home/state";
import { Announcement } from "./features/home/sections/Announcement";
import { SearchPanel } from "./features/home/sections/SearchPanel";
import { Header } from "./features/home/sections/Header";
import { Hero } from "./features/home/sections/Hero";
import { Marquee } from "./features/home/sections/Marquee";
import { Shop } from "./features/home/sections/Shop";
import { Event } from "./features/home/sections/Event";
import { Series } from "./features/home/sections/Series";
import { Community } from "./features/home/sections/Community";
import { Journal } from "./features/home/sections/Journal";
import { Faq } from "./features/home/sections/Faq";
import { About } from "./features/home/sections/About";
import { Trust } from "./features/home/sections/Trust";
import { Footer } from "./features/home/sections/Footer";
import { Overlays } from "./features/home/sections/Overlays";

const sections = { Announcement, Header, Hero, Marquee, Shop, Event, Series, Community, Journal, Faq, About, Trust, Footer };
type SectionName = keyof typeof sections;

function PosterApp() {
  const state = usePosterState();
  const [revision, setRevision] = useState(0);
  const shopify = document.documentElement.hasAttribute("data-poster-shopify");
  useEffect(() => {
    if (!shopify) return;
    const update = () => setRevision((value) => value + 1);
    document.addEventListener("shopify:section:load", update);
    document.addEventListener("shopify:section:unload", update);
    document.addEventListener("shopify:section:reorder", update);
    return () => {
      document.removeEventListener("shopify:section:load", update);
      document.removeEventListener("shopify:section:unload", update);
      document.removeEventListener("shopify:section:reorder", update);
    };
  }, [shopify]);
  useEffect(() => {
    if (!shopify) return;
    document.querySelector("[data-poster-header-shell]")?.classList.toggle("is-scrolled", state.scrolled);
  }, [shopify, state.scrolled]);
  // Read each section's own settings after Shopify refreshes its editor markup.
  void revision;
  const content = shopify
    ? Array.from(document.querySelectorAll<HTMLElement>("[data-poster-section]"), (node) => {
        const name = node.dataset.posterSection as SectionName;
        const Component = sections[name];
        if (!Component) return null;
        let settings: Record<string, string> = {};
        try { settings = JSON.parse(node.dataset.posterSettings || "{}"); } catch { /* use original defaults */ }
        if (node.dataset.posterBlocks !== undefined) settings._blocks = node.dataset.posterBlocks;
        if (node.dataset.posterMenu !== undefined) settings._menu = node.dataset.posterMenu;
        for (const [key, value] of Object.entries(node.dataset)) {
          if (key.startsWith("posterImage") && value) {
            const suffix = key.slice("posterImage".length).replace(/([A-Z])/g, "_$1").toLowerCase();
            settings[`image${suffix ? (suffix.startsWith("_") ? suffix : `_${suffix}`) : ""}`] = value;
          }
        }
        return createPortal(<Component settings={settings} />, node, node.dataset.posterId);
      })
    : <>
        <div className={`top-shell ${state.scrolled ? "is-scrolled" : ""}`}><Announcement /><Header /></div>
        {Object.entries(sections).filter(([name]) => name !== "Header" && name !== "Announcement").map(([name, Component]) => <Component key={name} />)}
      </>;
  return <PosterContext.Provider value={state}>{content}<SearchPanel /><Overlays /></PosterContext.Provider>;
}

export default function App() {
  return document.documentElement.hasAttribute("data-poster-shopify") ? <PosterApp /> : <main><PosterApp /></main>;
}
