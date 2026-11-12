import { useEffect, useState } from "react";
import { Icon } from "../Icon";
import { usePoster } from "../state";

type Settings = Record<string, string | boolean | number | undefined>;
type Slide = { id: string; image: string; title: string; description: string; buttonLabel: string; link: string };
type Block = { id: string; image: string | null; link_url?: string; settings: Record<string, string> };

const value = (settings: Settings, key: string, fallback = "") => typeof settings[key] === "string" ? settings[key] as string : fallback;
function slidesFor(settings: Settings): Slide[] {
  const fallback: Slide[] = [
    { id: "legacy-one", image: value(settings, "image_one") || "https://images.unsplash.com/photo-1766431546350-686a34c5b979?auto=format&fit=crop&w=1400&q=90", title: "ART THAT SPEAKS UP.", description: "Find the print that gives your space a voice.", buttonLabel: "EXPLORE PRINTS", link: value(settings, "link_one") || "#shop" },
    { id: "legacy-two", image: value(settings, "image_two") || "https://images.unsplash.com/photo-1586032788085-d75f745f26e0?auto=format&fit=crop&w=1400&q=90", title: "MAKE YOUR WALL TALK.", description: "Bring a little more personality to your space.", buttonLabel: "EXPLORE PRINTS", link: value(settings, "link_two") || "#shop" },
  ];
  try {
    const blocks = JSON.parse(value(settings, "_blocks", "[]")) as Block[];
    if (!blocks.length) return fallback;
    return blocks.map((block) => ({ id: block.id, image: block.image || "", title: block.settings.title || "", description: block.settings.description || "", buttonLabel: block.settings.button_label || "", link: block.link_url || "" }));
  } catch { return fallback; }
}

export function Event({ settings = {} }: { settings?: Settings }) {
  const { setFilter } = usePoster();
  const slides = slidesFor(settings);
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [editorPaused, setEditorPaused] = useState(false);
  const index = Math.min(active, slides.length - 1);
  const slide = slides[index];
  const interval = Math.max(3, Number(settings.interval) || 5) * 1000;
  const autoplay = settings.autoplay !== false && slides.length > 1;
  const paused = hovered || focused || editorPaused;
  useEffect(() => {
    const onSelect = (event: Event) => {
      const blockId = (event as CustomEvent<{ blockId?: string }>).detail?.blockId;
      const next = slides.findIndex((item) => item.id === blockId);
      if (next >= 0) { setActive(next); setEditorPaused(true); }
    };
    const onDeselect = () => setEditorPaused(false);
    document.addEventListener("shopify:block:select", onSelect);
    document.addEventListener("shopify:block:deselect", onDeselect);
    return () => { document.removeEventListener("shopify:block:select", onSelect); document.removeEventListener("shopify:block:deselect", onDeselect); };
  }, [settings._blocks]);
  if (!slide) return null;
  return (
    <section className="ow-event" id="manifesto" aria-label={value(settings, "heading", "CURATED PRINTS")} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocus={() => setFocused(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
      <div className="ow-event__rail"><h2>{value(settings, "heading", "CURATED PRINTS")}</h2></div>
      <div className="ow-event__copy">
        <span className="ow-event__eyebrow">{value(settings, "eyebrow", "FEATURED COLLECTIONS")}</span>
        <div className="ow-event__content" key={slide.id}>
          {slide.title && <h3>{slide.title}</h3>}
          {slide.description && <p>{slide.description}</p>}
          {slide.buttonLabel && slide.link && <a className="primary-cta" href={slide.link} onClick={() => { if (slide.id === "legacy-one") setFilter("Philosophy"); if (slide.id === "legacy-two") setFilter("Satire"); }}>{slide.buttonLabel} <Icon name="arrow" /></a>}
        </div>
        <div className="ow-event__thumbs" role="tablist" aria-label="Featured collections">
          {slides.map((item, position) => <button type="button" role="tab" aria-selected={position === index} className={position === index ? "is-active" : ""} key={item.id} onClick={() => setActive(position)} aria-label={item.title || `Slide ${position + 1}`}>
            {item.image && <img src={item.image} alt="" loading="lazy" />}
            {position === index && <span key={item.id} className={`ow-event__progress${autoplay ? " is-running" : ""}`} style={{ animationDuration: `${interval}ms`, animationPlayState: paused ? "paused" : "running" }} onAnimationEnd={() => { if (autoplay) setActive((current) => (current + 1) % slides.length); }} aria-hidden="true" />}
            <span className="ow-event__number">{String(position + 1).padStart(2, "0")}</span>
          </button>)}
        </div>
      </div>
      <div className="ow-event__visual">{slides.map((item, position) => item.image && <img key={item.id} className={position === index ? "is-active" : ""} src={item.image} alt={position === index ? item.title : ""} aria-hidden={position !== index} />)}</div>
    </section>
  );
}
