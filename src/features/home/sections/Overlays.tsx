import { usePoster } from "../state";
import { Icon } from "../Icon";

type Settings = Record<string, string | undefined>;
export function Overlays({ settings = {} }: { settings?: Settings }) {
  const { cartItems, cartOpen, setCartOpen, toast, setToast, cart, cartProducts, subtotal, updateQuantity } = usePoster();
  return (
    <>
      <button
        className={`drawer-backdrop ${cartOpen ? "is-open" : ""}`}
        onClick={() => setCartOpen(false)}
        aria-label="Close shopping bag"
      />
      <aside className={`cart-drawer ${cartOpen ? "is-open" : ""}`} aria-hidden={!cartOpen}>
        <div className="cart-head">
          <div>
            <span>YOUR BAG</span>
            <b>
              {cart} {cart === 1 ? "ITEM" : "ITEMS"}
            </b>
          </div>
          <button onClick={() => setCartOpen(false)} aria-label="Close shopping bag">
            <Icon name="close" />
          </button>
        </div>
        {cart === 0 ? (
          <div className="empty-cart">
            <span>:(</span>
            <h3>Your walls are waiting.</h3>
            <p>The bag is empty, but it doesn't have to stay that way.</p>
            <button
              onClick={() => {
                setCartOpen(false);
                window.location.hash = "shop";
              }}
            >
              Find a poster
            </button>
          </div>
        ) : (
          <>
            <div className="shipping-progress">
              <p>
                {subtotal >= 75
                  ? "You unlocked free shipping!"
                  : `$${75 - subtotal} away from free shipping`}
              </p>
              <div>
                <span style={{ width: `${Math.min(100, (subtotal / 75) * 100)}%` }} />
              </div>
            </div>
            <div className="cart-list">
              {cartProducts.map((product) => (
                <div className="cart-item" key={product.id}>
                  <div className="cart-thumb" style={{ background: product.color }}>
                    <img src={product.image} alt={product.name} />
                  </div>
                  <div className="cart-item-copy">
                    <small>{product.type} / A3 PRINT</small>
                    <strong>{product.name}</strong>
                    <div className="quantity">
                      <button
                        onClick={() => updateQuantity(product.id, -1)}
                        aria-label="Decrease quantity"
                      >
                        <Icon name="minus" />
                      </button>
                      <span>{cartItems[product.id]}</span>
                      <button
                        onClick={() => updateQuantity(product.id, 1)}
                        aria-label="Increase quantity"
                      >
                        <Icon name="plus" />
                      </button>
                    </div>
                  </div>
                  <b>${product.price * cartItems[product.id]}</b>
                </div>
              ))}
            </div>
            <div className="cart-checkout">
              <div>
                <span>Subtotal</span>
                <strong>${subtotal}</strong>
              </div>
              <button onClick={() => setToast("Checkout is ready for your payment integration")}>
                CHECKOUT <Icon name="arrow" />
              </button>
              <small>Taxes and shipping calculated at checkout.</small>
            </div>
          </>
        )}
      </aside>

      <div className={`toast ${toast ? "show" : ""}`}>{toast}</div>
    </>
  );
}
