import { usePoster } from "../state";
import { heroSlides } from "../data";
import { HeroCarousel } from "../HeroCarousel";

type Settings = Record<string, string | undefined>;
export function Hero({ settings = {} }: { settings?: Settings }) {
  const { setFilter } = usePoster();
  return (
    <>
      <HeroCarousel slides={heroSlides.map((slide, index) => ({
        ...slide,
        title: settings[`title_${index + 1}`] ?? slide.title,
        outline: settings[`outline_${index + 1}`] ?? slide.outline,
        description: settings[`description_${index + 1}`] ?? slide.description,
        image: settings[`image_${index + 1}`] || slide.image,
      }))} onCategorySelect={setFilter} />
    </>
  );
}
