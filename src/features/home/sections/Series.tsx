import { configuredItems } from "../configuredItems";
import { usePoster } from "../state";
import { Icon } from "../Icon";
import { productSeries } from "../data";

type Settings = Record<string, string | undefined>;
export function Series({ settings = {} }: { settings?: Settings }) {
  const { setFilter } = usePoster();
  return (
    <>
      <section className="series-section" id="series">
        <div className="series-heading">
          <div>
            <h2>{settings.heading ?? "Pick your department."}</h2>
          </div>
          <p>
            Three collections. Three moods.
            <br />
            One wall with something to say.
          </p>
        </div>
        <div className="series-grid">
          {configuredItems(settings, productSeries).map((series) => (
            <a
              href={series.link_url || "#shop"}
              className="series-card"
              style={{ backgroundColor: series.color }}
              onClick={() => setFilter(series.category)}
              key={series.name}
            >
              <div className="series-image">
                <img src={series.image} alt={`${series.name} poster collection`} />
                <span>{series.count}</span>
              </div>
              <div className="series-copy">
                <span>
                  {series.number} / {series.category}
                </span>
                <h3>{series.name}</h3>
                <p>{series.line}</p>
                <div>
                  VIEW SERIES <Icon name="arrow" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
