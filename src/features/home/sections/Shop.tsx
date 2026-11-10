import { usePoster } from "../state";
import { ProductCard } from "../ProductCard";

type Settings = Record<string, string | undefined>;
export function Shop({ settings = {} }: { settings?: Settings }) {
  const { filter, setFilter, liked, setLiked, filtered, addToCart } = usePoster();
  return (
    <>
      <section className="shop-section" id="shop">
        <div className="section-heading">
          <div>
            <h2>{settings.heading ?? "Fresh off the press"}</h2>
          </div>
          <p>
            No answers to life,
            <br />
            just better walls.
          </p>
        </div>
        <div className="filters" role="tablist" aria-label="Poster categories">
          {["All", "Philosophy", "Satire", "Icons"].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={filter === item ? "active" : ""}
              role="tab"
              aria-selected={filter === item}
            >
              {item} {item === "Philosophy" && <sup>3</sup>}
            </button>
          ))}
        </div>
        <div className="product-grid product-grid-animated" key={filter}>
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              liked={liked.includes(product.id)}
              onLike={() =>
                setLiked((items) =>
                  items.includes(product.id)
                    ? items.filter((id) => id !== product.id)
                    : [...items, product.id],
                )
              }
              onAdd={() => addToCart(product)}
            />
          ))}
        </div>
      </section>
    </>
  );
}
