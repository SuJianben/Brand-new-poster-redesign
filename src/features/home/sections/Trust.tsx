import { configuredItems } from "../configuredItems";
import { TrustIcon, type TrustIconName } from "../TrustIcon";

type Settings = Record<string, string | undefined>;
const defaults: { icon: TrustIconName; title: string; description: string }[] = [
  { icon: "paper", title: "Museum-grade paper", description: "Heavy, tactile 230gsm stock with rich pigment inks that stay loud." },
  { icon: "leaf", title: "Printed responsibly", description: "FSC-certified paper, water-based inks, and plastic-free packaging." },
  { icon: "shipping", title: "Ships worldwide", description: "Tracked delivery in protective tubes. Free shipping over $75." },
  { icon: "return", title: "30-day returns", description: "Changed your mind? Send it back, no awkward questions attached." },
];

export function Trust({ settings = {} }: { settings?: Settings }) {
  const showScore = (settings as Record<string, unknown>).show_score !== false;
  return (
    <section className={`trust-section${showScore ? "" : " trust-section--no-score"}`} aria-label="Why shop with Odd Wall">
      {showScore && <div className="trust-score">
        <span>{settings.heading ?? "TRUST THE PROCESS"}</span>
        <strong>{settings.score ?? "4.9"}</strong>
        <div>★★★★★</div>
        <p>{settings.description ?? "Based on 1,200+ very opinionated walls."}</p>
      </div>}
      <div className="trust-grid">
        {configuredItems(settings, defaults).map((item, index) => (
          <article key={index}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <TrustIcon name={item.icon} />
            <strong>{item.title}</strong>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
