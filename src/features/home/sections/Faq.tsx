import { configuredItems } from "../configuredItems";
import { Icon } from "../Icon";
import { faqItems } from "../data";

type Settings = Record<string, string | undefined>;
export function Faq({ settings = {} }: { settings?: Settings }) {

  return (
    <>
      <section className="faq-section" id="faq">
        <div className="faq-heading">
          <h2>{settings.heading ?? "Questions, answered."}</h2>
          <p>Everything worth knowing before your wall gets louder.</p>
        </div>
        <div className="faq-card-grid">
          {configuredItems(settings, faqItems).map((item, index) => (
            <article className={`faq-card faq-card-${(index % 3) + 1}`} key={item.question}>
              <div className="faq-card-top">
                <span>0{index + 1}</span>
                <Icon name="arrow" />
              </div>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
