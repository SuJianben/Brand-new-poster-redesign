
type Settings = Record<string, string | undefined>;
export function Trust({ settings = {} }: { settings?: Settings }) {

  return (
    <>
      <section className="trust-section" aria-label="Why shop with Odd Wall">
        <div className="trust-score">
          <span>{settings.heading ?? "TRUST THE PROCESS"}</span>
          <strong>4.9</strong>
          <div>★★★★★</div>
          <p>Based on 1,200+ very opinionated walls.</p>
        </div>
        <div className="trust-grid">
          <article>
            <span>01</span>
            <strong>Museum-grade paper</strong>
            <p>Heavy, tactile 230gsm stock with rich pigment inks that stay loud.</p>
          </article>
          <article>
            <span>02</span>
            <strong>Printed responsibly</strong>
            <p>FSC-certified paper, water-based inks, and plastic-free packaging.</p>
          </article>
          <article>
            <span>03</span>
            <strong>Ships worldwide</strong>
            <p>Tracked delivery in protective tubes. Free shipping over $75.</p>
          </article>
          <article>
            <span>04</span>
            <strong>30-day returns</strong>
            <p>Changed your mind? Send it back, no awkward questions attached.</p>
          </article>
        </div>
      </section>
    </>
  );
}
