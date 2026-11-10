import { useEffect, useState } from "react";
import { Icon } from "./Icon";
import { heroSlides } from "./data";
export type HeroSlide = (typeof heroSlides)[number] & { id?: string; cta_link?: string };

export function HeroCarousel({
  slides,
  onCategorySelect,
}: {
  slides: HeroSlide[];
  onCategorySelect: (category: string) => void;
}) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const safeIndex = Math.min(activeSlide, Math.max(0, slides.length - 1));
  const slide = slides[safeIndex];

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const timer = window.setInterval(
      () => setActiveSlide((current) => (current + 1) % slides.length),
      5000,
    );
    return () => window.clearInterval(timer);
  }, [paused, slides.length]);

  useEffect(() => {
    const onSelect = (event: Event) => {
      const id = (event as CustomEvent<{ blockId?: string }>).detail?.blockId;
      const index = slides.findIndex((item) => item.id === id);
      if (index >= 0) { setActiveSlide(index); setPaused(true); }
    };
    const onDeselect = () => setPaused(false);
    document.addEventListener("shopify:block:select", onSelect);
    document.addEventListener("shopify:block:deselect", onDeselect);
    return () => {
      document.removeEventListener("shopify:block:select", onSelect);
      document.removeEventListener("shopify:block:deselect", onDeselect);
    };
  }, [slides]);

  if (!slide) return null;

  const move = (direction: number) => {
    setActiveSlide((current) => (safeIndex + direction + slides.length) % slides.length);
  };

  return (
    <section
      className="hero hero-carousel"
      id="top"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured poster collections"
    >
      <div className="hero-copy" key={`copy-${activeSlide}`}>
        <div className="eyebrow">
          <span></span> {slide.eyebrow}
        </div>
        <h1>
          <span>{slide.title}</span>
          <span className="outline">{slide.outline}</span>
        </h1>
        <p>{slide.description}</p>
        <div className="hero-actions">
          <a className="primary-cta" href={slide.cta_link || "#shop"} onClick={() => onCategorySelect(slide.category)}>
            {slide.cta} <Icon name="arrow" />
          </a>
          <div className="carousel-controls">
            <button
              className="carousel-arrow previous"
              onClick={() => move(-1)}
              aria-label="Previous slide"
            >
              <Icon name="arrow" />
            </button>
            <div className="carousel-dots" role="tablist" aria-label="Choose a slide">
              {slides.map((item, index) => (
                <button
                  key={item.id || item.number}
                  className={index === safeIndex ? "active" : ""}
                  onClick={() => setActiveSlide(index)}
                  aria-label={`Show slide ${index + 1}: ${item.title}`}
                  aria-selected={index === safeIndex}
                  role="tab"
                />
              ))}
            </div>
            <span className="carousel-count">
              {String(safeIndex + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
            </span>
            <button className="carousel-arrow next" onClick={() => move(1)} aria-label="Next slide">
              <Icon name="arrow" />
            </button>
          </div>
        </div>
      </div>

      <div className="hero-art" key={`art-${activeSlide}`} style={{ backgroundColor: slide.color }}>
        <div className="burst">
          NEW
          <br />
          DROP
        </div>
        <div className="scribble">{slide.mark}</div>
        <div className="poster-cluster">
          <div className="hero-poster">
            <img src={slide.image} alt={slide.alt} />
            <div className="hero-poster-copy">
              <small>{slide.kicker}</small>
              <strong>{slide.posterTitle}</strong>
              <span>{slide.posterLine}</span>
            </div>
            <i>NO. {slide.number}</i>
          </div>
          <span className="tape tape-one"></span>
          <span className="tape tape-two"></span>
        </div>
        <div className="round-sticker">{slide.sticker}</div>
      </div>
    </section>
  );
}

