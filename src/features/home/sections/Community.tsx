import { configuredItems } from "../configuredItems";
import { socialPosts } from "../data";

type Settings = Record<string, string | undefined>;
export function Community({ settings = {} }: { settings?: Settings }) {

  return (
    <>
      <section className="social-wall" id="community">
        <div className="social-heading">
          <div>
            <h2>{settings.heading ?? "Good walls, great people."}</h2>
          </div>
          <div className="social-intro">
            <p>
              Tag <strong>@ODDWALL.STUDIO</strong> for a chance to end up on this very wall.
            </p>
          </div>
        </div>
        <div className="social-grid">
          {configuredItems(settings, socialPosts).map((post, index) => (
            <a className={`social-post post-${index + 1}`} href={post.link_url || "#community"} key={post.handle}>
              <img src={post.image} alt={post.alt} />
              <div>
                <strong>{post.handle}</strong>
                <span>VIEW POST →</span>
              </div>
              <small>Photo · {post.credit}</small>
            </a>
          ))}
        </div>
        <blockquote className="social-quote">
          <div>★★★★★</div>
          <p>“The print quality is unreal. My blank wall finally has a personality.”</p>
          <cite>— JAMIE, VERIFIED BUYER</cite>
        </blockquote>
      </section>
    </>
  );
}
