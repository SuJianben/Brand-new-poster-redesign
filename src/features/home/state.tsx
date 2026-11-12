import { createContext, useContext, useEffect, useState } from "react";
import { products } from "./data";

export function usePosterState() {
  const [filter, setFilter] = useState("All");
  const [liked, setLiked] = useState<number[]>([]);
  const [cartItems, setCartItems] = useState<Record<number, number>>({});
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    document.dispatchEvent(new CustomEvent("poster:category-select", { detail: filter }));
  }, [filter]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 1800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = searchOpen || cartOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [searchOpen, cartOpen]);

  const filtered = filter === "All" ? products : products.filter((item) => item.type === filter);
  const cart = Object.values(cartItems).reduce((total, quantity) => total + quantity, 0);
  const cartProducts = products.filter((product) => cartItems[product.id]);
  const subtotal = cartProducts.reduce(
    (total, product) => total + product.price * cartItems[product.id],
    0,
  );
  const searchResults = products.filter((product) =>
    `${product.name} ${product.type}`.toLowerCase().includes(search.toLowerCase()),
  );
  const closePanels = () => {
    setSearchOpen(false);
    setCartOpen(false);
  };

  const addToCart = (product: (typeof products)[number]) => {
    setCartItems((items) => ({ ...items, [product.id]: (items[product.id] || 0) + 1 }));
    setToast(`${product.name} is in the bag`);
  };

  const updateQuantity = (id: number, change: number) => {
    setCartItems((items) => {
      const next = Math.max(0, (items[id] || 0) + change);
      const updated = { ...items };
      if (next === 0) delete updated[id];
      else updated[id] = next;
      return updated;
    });
  };

  return { filter, setFilter, liked, setLiked, cartItems, searchOpen, setSearchOpen, cartOpen, setCartOpen, search, setSearch, scrolled, toast, setToast, filtered, cart, cartProducts, subtotal, searchResults, closePanels, addToCart, updateQuantity };
}

export type PosterState = ReturnType<typeof usePosterState>;
export const PosterContext = createContext<PosterState | null>(null);
export function usePoster() {
  const context = useContext(PosterContext);
  if (!context) throw new Error("Poster context is missing");
  return context;
}
