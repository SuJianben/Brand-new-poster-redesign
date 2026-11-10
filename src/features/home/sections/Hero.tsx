import { usePoster } from "../state";
import { heroSlides } from "../data";
import { HeroCarousel, type HeroSlide } from "../HeroCarousel";

type Settings = Record<string, string | undefined>;
type SlideBlock = { id: string; settings: Record<string, string>; image: string | null };

function readSlides(settings: Settings): HeroSlide[] {
  if (settings._blocks === undefined) return heroSlides;
  try {
    const blocks = JSON.parse(settings._blocks) as SlideBlock[];
    return blocks.map(({ id, settings: item, image }) => ({
      ...heroSlides[0], ...item, id,
      posterTitle: item.poster_title ?? "",
      posterLine: item.poster_line ?? "",
      image: image || item.image || "",
    }));
  } catch {
    return heroSlides;
  }
}

export function Hero({ settings = {} }: { settings?: Settings }) {
  const { setFilter } = usePoster();
  return <HeroCarousel slides={readSlides(settings)} onCategorySelect={setFilter} />;
}
