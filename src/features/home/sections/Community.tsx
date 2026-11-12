import { useCallback, useState } from "react";
import { readCommunityPosts, type CommunityPost } from "../communityPosts";
import { CommunityModal } from "./CommunityModal";

type Settings = Record<string, string | undefined>;
export function Community({ settings = {} }: { settings?: Settings }) {
  const [selected, setSelected] = useState<CommunityPost | null>(null);
  const close = useCallback(() => setSelected(null), []);

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
          {readCommunityPosts(settings).map((post, index) => (
            <button type="button" className={`social-post post-${index + 1}`} onClick={() => setSelected(post)} aria-label={`View products featured by ${post.handle || "this post"}`} key={post.id || `${post.handle}-${index}`}>
              <img src={post.image} alt={post.alt} />
              <div>
                <strong>{post.handle}</strong>
                <span>VIEW POST →</span>
              </div>
              <small>Photo · {post.credit}</small>
            </button>
          ))}
        </div>
        <blockquote className="social-quote">
          <div>★★★★★</div>
          <p>“The print quality is unreal. My blank wall finally has a personality.”</p>
          <cite>— JAMIE, VERIFIED BUYER</cite>
        </blockquote>
      </section>
      {selected && <CommunityModal post={selected} onClose={close} />}
    </>
  );
}
