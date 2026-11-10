import { usePoster } from "../state";

type Settings = Record<string, string | undefined>;
export function Event({ settings = {} }: { settings?: Settings }) {
  const { setFilter } = usePoster();
  return (
    <>
      <section className="event-showcase" id="manifesto" aria-label="Odd Wall art event">
        <a
          href="#shop"
          onClick={() => setFilter("Philosophy")}
          aria-label="Shop the abstract philosophy campaign"
        >
          <img
            src={settings.image_one || "https://images.unsplash.com/photo-1766431546350-686a34c5b979?auto=format&fit=crop&w=1400&q=90"}
            alt="Pink and teal abstract geometric campaign artwork"
          />
        </a>
        <a
          href="#shop"
          onClick={() => setFilter("Satire")}
          aria-label="Shop the colorful satire campaign"
        >
          <img
            src={settings.image_two || "https://images.unsplash.com/photo-1586032788085-d75f745f26e0?auto=format&fit=crop&w=1400&q=90"}
            alt="Red blue and white abstract campaign artwork"
          />
        </a>
      </section>
    </>
  );
}
