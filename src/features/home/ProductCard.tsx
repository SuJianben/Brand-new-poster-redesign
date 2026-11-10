import { Icon } from "./Icon";
import { products } from "./data";
export function ProductCard({
  product,
  liked,
  onLike,
  onAdd,
}: {
  product: (typeof products)[number];
  liked: boolean;
  onLike: () => void;
  onAdd: () => void;
}) {
  return (
    <article className="product-card group">
      <div className="poster-wrap" style={{ backgroundColor: product.color }}>
        <div className="poster-paper">
          <img src={product.image} alt={`${product.name} art poster`} />
          <span className="poster-index">0{product.id}</span>
          <span className="poster-type">{product.type}</span>
          <div className="poster-title">
            <strong>{product.en.split(" ").slice(0, 2).join(" ")}</strong>
            <small>{product.en.split(" ").slice(2).join(" ")}</small>
          </div>
          <span className="image-credit">Photo · {product.credit}</span>
        </div>
        <button
          className={`like-btn ${liked ? "is-liked" : ""}`}
          onClick={onLike}
          aria-label={liked ? "Remove from favorites" : "Add to favorites"}
        >
          <Icon name="heart" />
        </button>
        <button className="quick-add" onClick={onAdd}>
          Add to bag <Icon name="arrow" />
        </button>
      </div>
      <div className="product-info">
        <div>
          <p>{product.type} / LIMITED PRINT</p>
          <h3>{product.name}</h3>
        </div>
        <strong>${product.price}</strong>
      </div>
    </article>
  );
}

