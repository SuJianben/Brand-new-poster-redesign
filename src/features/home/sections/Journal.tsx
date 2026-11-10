import { configuredItems } from "../configuredItems";
import { Icon } from "../Icon";
import { journalPosts } from "../data";

type Settings = Record<string, string | undefined>;
export function Journal({ settings = {} }: { settings?: Settings }) {

  return (
    <>
      <section className="journal-section" id="journal">
        <div className="journal-heading">
          <div>
            <h2>{settings.heading ?? "Read something strange."}</h2>
          </div>
          <a className="primary-cta" href="#journal">
            View all stories <Icon name="arrow" />
          </a>
        </div>
        <div className="journal-grid">
          {configuredItems(settings, journalPosts).map((post, index) => (
            <article className={`journal-card journal-card-${index + 1}`} key={post.title}>
              <a className="journal-image" href="#journal">
                <img src={post.image} alt={post.alt} />
                <small>Photo · {post.credit}</small>
              </a>
              <div className="journal-meta">
                <span>{post.tag}</span>
                <span>{post.date}</span>
              </div>
              <h3>
                <a href="#journal">{post.title}</a>
              </h3>
              <p>{post.excerpt}</p>
              <a className="journal-link" href="#journal">
                READ STORY <Icon name="arrow" />
              </a>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
