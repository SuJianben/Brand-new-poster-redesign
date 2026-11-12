import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import type { CommunityPost } from "../communityPosts";
import { Icon } from "../Icon";

export function CommunityModal({ post, onClose }: { post: CommunityPost; onClose: () => void }) {
  const dialog = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); onClose(); return; }
      if (event.key !== "Tab" || !dialog.current) return;
      const elements = Array.from(dialog.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'));
      if (!elements.length) { event.preventDefault(); return; }
      const first = elements[0]; const last = elements[elements.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog.current)) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => { document.removeEventListener("keydown", onKeyDown); document.body.style.overflow = previousOverflow; previousFocus?.focus(); };
  }, [onClose]);

  return createPortal(
    <div className="ow-social-dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="ow-social-dialog" role="dialog" aria-modal="true" aria-labelledby={titleId} ref={dialog} tabIndex={-1}>
        <button className="ow-social-dialog__close" type="button" onClick={onClose} aria-label="Close"><Icon name="close" /></button>
        <div className="ow-social-dialog__image">{post.image && <img src={post.image} alt={post.alt} />}</div>
        <div className="ow-social-dialog__details">
          <div className="ow-social-dialog__heading"><span>{post.handle}</span><h2 id={titleId}>SHOP THE LOOK<span>!</span></h2></div>
          {post.products.length > 0 && <div className="ow-social-dialog__products">{post.products.map((product) => (
            <a className="ow-social-dialog__product" href={product.url} key={product.id}>
              <div className="ow-social-dialog__product-image">{product.image && <img src={product.image} alt="" loading="lazy" />}</div>
              <div><strong>{product.title}</strong><span>{product.price_varies ? "From " : ""}{product.price}</span></div>
              <Icon name="arrow" />
            </a>
          ))}</div>}
          {post.link_url && post.link_url !== "#community" && <a className="ow-social-dialog__original" href={post.link_url}>VIEW ORIGINAL POST <Icon name="arrow" /></a>}
        </div>
      </div>
    </div>, document.body,
  );
}
