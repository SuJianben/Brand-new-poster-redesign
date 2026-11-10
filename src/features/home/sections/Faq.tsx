import { configuredItems } from "../configuredItems";
import { Icon } from "../Icon";
import { faqItems } from "../data";

type Settings = Record<string, string | undefined>;

export function Faq({ settings = {} }: { settings?: Settings }) {
  return (
    <section className="faq-section" id="faq">
      <div className="faq-heading">
        <h2>{settings.heading ?? "Questions, answered."}</h2>
        <p>Everything worth knowing before your wall gets louder.</p>
      </div>
      <div className="faq-card-grid">
        {configuredItems(settings, faqItems).map((item, index) => (
          <details className={`faq-card faq-card-${(index % 3) + 1}`} key={`${index}-${item.question}`}>
            <summary className="faq-trigger">
              <span className="faq-number">{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.question}</h3>
              <Icon name="arrow" />
            </summary>
            <p className="faq-answer">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
