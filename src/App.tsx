import { useEffect, useState } from "react";

type IconName = "arrow" | "bag" | "heart" | "close" | "star" | "search" | "minus" | "plus";

function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: (
      <>
        <path d="M5 12h14M13 6l6 6-6 6" />
      </>
    ),
    bag: (
      <>
        <path d="M6 8h12l1 13H5L6 8Z" />
        <path d="M9 9V6a3 3 0 0 1 6 0v3" />
      </>
    ),
    heart: (
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
    ),
    close: (
      <>
        <path d="m6 6 12 12M18 6 6 18" />
      </>
    ),
    star: <path d="m12 2 2.4 6.7 7.1.2-5.6 4.4 2 6.8-5.9-4-5.9 4 2-6.8-5.6-4.4 7.1-.2L12 2Z" />,
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    minus: <path d="M5 12h14" />,
    plus: (
      <>
        <path d="M5 12h14" />
        <path d="M12 5v14" />
      </>
    ),
  };
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

const products = [
  {
    id: 1,
    name: "Sisyphus Off Duty",
    en: "SISYPHUS OFF DUTY",
    type: "Philosophy",
    price: 39,
    color: "#ff5c35",
    image:
      "https://images.unsplash.com/photo-1563866184968-90891f21ed5a?auto=format&fit=crop&w=900&q=85",
    credit: "Nikolina Bobic",
  },
  {
    id: 2,
    name: "Think in Blue",
    en: "THINK IN BLUE",
    type: "Philosophy",
    price: 42,
    color: "#6c5ce7",
    image:
      "https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?auto=format&fit=crop&w=900&q=85",
    credit: "SIMON LEE",
  },
  {
    id: 3,
    name: "Not That Serious",
    en: "NOT THAT SERIOUS",
    type: "Satire",
    price: 32,
    color: "#dfff00",
    image:
      "https://images.unsplash.com/photo-1578831914933-6339766eb29b?auto=format&fit=crop&w=900&q=85",
    credit: "Luke Jones",
  },
  {
    id: 4,
    name: "Main Character Energy",
    en: "MAIN CHARACTER",
    type: "Icons",
    price: 45,
    color: "#ff48a5",
    image:
      "https://images.unsplash.com/photo-1617690032954-692168050cac?auto=format&fit=crop&w=900&q=85",
    credit: "Brian Lawson",
  },
  {
    id: 5,
    name: "Existence Before Filters",
    en: "NO FILTER NEEDED",
    type: "Philosophy",
    price: 38,
    color: "#13c8a3",
    image:
      "https://images.unsplash.com/photo-1563866324237-b96257084cd7?auto=format&fit=crop&w=900&q=85",
    credit: "Nikolina Bobic",
  },
  {
    id: 6,
    name: "Color Riot",
    en: "COLOR RIOT",
    type: "Icons",
    price: 44,
    color: "#ff9f1c",
    image:
      "https://images.unsplash.com/photo-1667419136229-ce2c6e127a43?auto=format&fit=crop&w=900&q=85",
    credit: "Jay Lamm",
  },
];

const heroSlides = [
  {
    eyebrow: "ART FOR LOUD MINDS",
    title: "YOUR WALLS",
    outline: "HATE BORING",
    description:
      "Pull philosophy off the shelf and put it on the wall. Original art prints that speak before you do.",
    cta: "Shop philosophy",
    category: "Philosophy",
    color: "#6c5ce7",
    image:
      "https://images.unsplash.com/photo-1626803302532-b83560c4d946?auto=format&fit=crop&w=1200&q=90",
    alt: "Creative philosophy poster featuring a classical statue",
    kicker: "THE ART OF",
    posterTitle: "THINKING",
    posterLine: "THINKING IS A STREET SPORT.",
    number: "001",
    mark: "?",
    sticker: "ONLY 100 MADE",
  },
  {
    eyebrow: "SERIOUSLY NOT SERIOUS",
    title: "BAD IDEAS",
    outline: "LOOK GOOD",
    description:
      "Satire for walls tired of inspirational quotes. Strange ideas, printed loud and made to keep.",
    cta: "Shop satire",
    category: "Satire",
    color: "#ff5c35",
    image:
      "https://images.unsplash.com/photo-1578831914933-6339766eb29b?auto=format&fit=crop&w=1200&q=90",
    alt: "Surreal humorous portrait art poster",
    kicker: "DON'T TAKE IT",
    posterTitle: "SERIOUSLY",
    posterLine: "LIFE IS ALREADY WEIRD ENOUGH.",
    number: "002",
    mark: ":P",
    sticker: "WEIRD BY DESIGN",
  },
  {
    eyebrow: "MAIN CHARACTER MATERIAL",
    title: "ICON MODE",
    outline: "STAYS LOUD",
    description:
      "Cult color and main-character energy. Give the people you love a permanent place on your wall.",
    cta: "Shop icons",
    category: "Icons",
    color: "#ff48a5",
    image:
      "https://images.unsplash.com/photo-1617690032954-692168050cac?auto=format&fit=crop&w=1200&q=90",
    alt: "Colorful editorial portrait art poster",
    kicker: "A MOMENT OF",
    posterTitle: "COLOR",
    posterLine: "MAKE ROOM FOR THE SPOTLIGHT.",
    number: "003",
    mark: "★",
    sticker: "NEW ICON DROP",
  },
];

const socialPosts = [
  {
    image:
      "https://images.unsplash.com/photo-1659640219304-b5656eee3465?auto=format&fit=crop&w=1200&q=85",
    alt: "Colorful living room with art prints above a blue sofa",
    handle: "@ROOMFORODD",
    credit: "Steph Wilson",
  },
  {
    image:
      "https://images.unsplash.com/photo-1650137959510-d64eef290e86?auto=format&fit=crop&w=900&q=85",
    alt: "Eclectic gallery wall in a colorful apartment",
    handle: "@WALLTALKDAILY",
    credit: "Steph Wilson",
  },
  {
    image:
      "https://images.unsplash.com/photo-1758718036788-de50f9fd2192?auto=format&fit=crop&w=1000&q=85",
    alt: "Creative studio desk with framed wall art",
    handle: "@STUDIOAFTERDARK",
    credit: "Annie Spratt",
  },
  {
    image:
      "https://images.unsplash.com/photo-1650138318699-a7916aced967?auto=format&fit=crop&w=900&q=85",
    alt: "Bright living room full of framed artwork",
    handle: "@MAXIMALMOOD",
    credit: "Steph Wilson",
  },
  {
    image:
      "https://images.unsplash.com/photo-1650137269022-cbeaf3274bf7?auto=format&fit=crop&w=900&q=85",
    alt: "Vertical view of an eclectic art-filled home",
    handle: "@NOEMPTYWALLS",
    credit: "Steph Wilson",
  },
];

const productSeries = [
  {
    number: "01",
    name: "The Thinkers",
    category: "Philosophy",
    count: "12 PRINTS",
    line: "Big questions. Better walls.",
    color: "#6c5ce7",
    image:
      "https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?auto=format&fit=crop&w=1200&q=85",
  },
  {
    number: "02",
    name: "Comic Relief",
    category: "Satire",
    count: "08 PRINTS",
    line: "For rooms that take nothing seriously.",
    color: "#ff5c35",
    image:
      "https://images.unsplash.com/photo-1578831914933-6339766eb29b?auto=format&fit=crop&w=1200&q=85",
  },
  {
    number: "03",
    name: "The Icon File",
    category: "Icons",
    count: "10 PRINTS",
    line: "Cult energy, permanently on display.",
    color: "#ff48a5",
    image:
      "https://images.unsplash.com/photo-1617690032954-692168050cac?auto=format&fit=crop&w=1200&q=85",
  },
];

const journalPosts = [
  {
    tag: "BEHIND THE PRINT",
    date: "08 MIN READ",
    title: "Why the best posters still start with ink and a mess",
    excerpt: "Inside the hands-on process behind our loudest limited editions.",
    image:
      "https://images.unsplash.com/photo-1663433567177-9f94be0bff4c?auto=format&fit=crop&w=1400&q=85",
    alt: "Artist working at a printing machine",
    credit: "Anthony Roberts",
  },
  {
    tag: "WALL THEORY",
    date: "05 MIN READ",
    title: "How to build a gallery wall without overthinking it",
    excerpt: "A practical guide to scale, spacing, color, and breaking the rules.",
    image:
      "https://images.unsplash.com/photo-1578855019520-af8101c056e2?auto=format&fit=crop&w=1100&q=85",
    alt: "Colorful paintings inside a contemporary gallery",
    credit: "Mike Von",
  },
  {
    tag: "STREET NOTES",
    date: "04 MIN READ",
    title: "What the street taught us about typography",
    excerpt: "Layers, accidents, and letters that refuse to whisper.",
    image:
      "https://images.unsplash.com/photo-1770274484406-09405c9c01df?auto=format&fit=crop&w=1100&q=85",
    alt: "Urban wall covered with layered posters and flyers",
    credit: "moniek van rosse",
  },
];

const faqItems = [
  {
    question: "What sizes are the posters?",
    answer:
      "Most designs are available in A3, A2, and 50 × 70 cm. The exact options are listed on each product page.",
  },
  {
    question: "Do the prints arrive framed?",
    answer:
      "Prints are sold unframed so you can choose what works for your space. Every poster ships safely rolled in a protective tube.",
  },
  {
    question: "How long does worldwide shipping take?",
    answer:
      "Orders usually leave our studio within 2–3 business days. Tracked international delivery typically takes 5–12 business days.",
  },
  {
    question: "What makes the paper museum-grade?",
    answer:
      "We print on heavyweight FSC-certified archival stock using pigment inks designed to keep their depth and color for decades.",
  },
  {
    question: "Can I return a print?",
    answer:
      "Yes. Unframed prints can be returned within 30 days in their original condition and packaging.",
  },
];

function ProductCard({
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

function HeroCarousel({
  slides,
  onCategorySelect,
}: {
  slides: typeof heroSlides;
  onCategorySelect: (category: string) => void;
}) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const slide = slides[activeSlide];

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(
      () => setActiveSlide((current) => (current + 1) % slides.length),
      5000,
    );
    return () => window.clearInterval(timer);
  }, [paused, slides.length]);

  const move = (direction: number) => {
    setActiveSlide((current) => (current + direction + slides.length) % slides.length);
  };

  return (
    <section
      className="hero hero-carousel"
      id="top"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured poster collections"
    >
      <div className="hero-copy" key={`copy-${activeSlide}`}>
        <div className="eyebrow">
          <span></span> {slide.eyebrow}
        </div>
        <h1>
          <span>{slide.title}</span>
          <span className="outline">{slide.outline}</span>
        </h1>
        <p>{slide.description}</p>
        <div className="hero-actions">
          <a className="primary-cta" href="#shop" onClick={() => onCategorySelect(slide.category)}>
            {slide.cta} <Icon name="arrow" />
          </a>
          <div className="carousel-controls">
            <button
              className="carousel-arrow previous"
              onClick={() => move(-1)}
              aria-label="Previous slide"
            >
              <Icon name="arrow" />
            </button>
            <div className="carousel-dots" role="tablist" aria-label="Choose a slide">
              {slides.map((item, index) => (
                <button
                  key={item.number}
                  className={index === activeSlide ? "active" : ""}
                  onClick={() => setActiveSlide(index)}
                  aria-label={`Show slide ${index + 1}: ${item.title}`}
                  aria-selected={index === activeSlide}
                  role="tab"
                />
              ))}
            </div>
            <span className="carousel-count">
              0{activeSlide + 1} / 0{slides.length}
            </span>
            <button className="carousel-arrow next" onClick={() => move(1)} aria-label="Next slide">
              <Icon name="arrow" />
            </button>
          </div>
        </div>
      </div>

      <div className="hero-art" key={`art-${activeSlide}`} style={{ backgroundColor: slide.color }}>
        <div className="burst">
          NEW
          <br />
          DROP
        </div>
        <div className="scribble">{slide.mark}</div>
        <div className="poster-cluster">
          <div className="hero-poster">
            <img src={slide.image} alt={slide.alt} />
            <div className="hero-poster-copy">
              <small>{slide.kicker}</small>
              <strong>{slide.posterTitle}</strong>
              <span>{slide.posterLine}</span>
            </div>
            <i>NO. {slide.number}</i>
          </div>
          <span className="tape tape-one"></span>
          <span className="tape tape-two"></span>
        </div>
        <div className="round-sticker">{slide.sticker}</div>
      </div>
    </section>
  );
}

export default function App() {
  const [filter, setFilter] = useState("All");
  const [liked, setLiked] = useState<number[]>([]);
  const [cartItems, setCartItems] = useState<Record<number, number>>({});
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [toast, setToast] = useState("");

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

  return (
    <main>
      <div className={`top-shell ${scrolled ? "is-scrolled" : ""}`}>
        <div className="announcement">
          <span>FREE WORLDWIDE SHIPPING OVER $75</span>
          <span className="announcement-center">NEW DROP: THINKING IS A STREET SPORT</span>
          <a href="#shop">SHOP THE DROP →</a>
        </div>
        <header className="site-header">
          <a className="logo" href="#top" aria-label="Odd Wall home" onClick={closePanels}>
            <span>ODD</span>WALL<span className="logo-dot">!</span>
          </a>
          <nav className="desktop-nav" aria-label="Main navigation">
            <a href="#shop">Shop all</a>
            <a href="#manifesto">Events</a>
            <a href="#series">Collections</a>
          </nav>
          <div className="header-actions">
            <button
              className="icon-button search-button"
              onClick={() => {
                setSearchOpen(!searchOpen);
                setCartOpen(false);
              }}
              aria-label="Search"
            >
              <Icon name="search" />
            </button>
            <button
              className="bag-button"
              onClick={() => {
                setCartOpen(true);
                setSearchOpen(false);
              }}
              aria-label={`Open bag with ${cart} items`}
            >
              <Icon name="bag" />
              <span>Bag</span>
              <b>{cart}</b>
            </button>
          </div>
        </header>
        <nav className="mobile-link-bar" aria-label="Mobile navigation">
          <a href="#shop">Shop all</a>
          <a href="#manifesto">Events</a>
          <a href="#series">Collections</a>
        </nav>
      </div>

      <div className={`search-panel ${searchOpen ? "is-open" : ""}`} aria-hidden={!searchOpen}>
        <div className="search-inner">
          <Icon name="search" />
          <input
            autoFocus={searchOpen}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search posters, moods, ideas..."
            aria-label="Search posters"
          />
          <button onClick={() => setSearchOpen(false)} aria-label="Close search">
            <Icon name="close" />
          </button>
        </div>
        {search && (
          <div className="search-results">
            <span>{searchResults.length} RESULTS</span>
            {searchResults.slice(0, 4).map((product) => (
              <a
                key={product.id}
                href="#shop"
                onClick={() => {
                  setFilter(product.type);
                  setSearchOpen(false);
                }}
              >
                <img src={product.image} alt="" />
                <div>
                  <small>{product.type}</small>
                  <strong>{product.name}</strong>
                </div>
                <b>${product.price}</b>
              </a>
            ))}
            {!searchResults.length && <p>No posters found. Try something a little stranger.</p>}
          </div>
        )}
      </div>

      <HeroCarousel slides={heroSlides} onCategorySelect={setFilter} />

      <div className="marquee" aria-hidden="true">
        <div>
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i}>
              PHILOSOPHY LEFT THE LIBRARY <Icon name="star" /> MAKE YOUR WALL TALK{" "}
              <Icon name="star" />
            </span>
          ))}
        </div>
      </div>

      <section className="shop-section" id="shop">
        <div className="section-heading">
          <div>
            <h2>Fresh off the press</h2>
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

      <section className="event-showcase" id="manifesto" aria-label="Odd Wall art event">
        <a
          href="#shop"
          onClick={() => setFilter("Philosophy")}
          aria-label="Shop the abstract philosophy campaign"
        >
          <img
            src="https://images.unsplash.com/photo-1766431546350-686a34c5b979?auto=format&fit=crop&w=1400&q=90"
            alt="Pink and teal abstract geometric campaign artwork"
          />
        </a>
        <a
          href="#shop"
          onClick={() => setFilter("Satire")}
          aria-label="Shop the colorful satire campaign"
        >
          <img
            src="https://images.unsplash.com/photo-1586032788085-d75f745f26e0?auto=format&fit=crop&w=1400&q=90"
            alt="Red blue and white abstract campaign artwork"
          />
        </a>
      </section>

      <section className="series-section" id="series">
        <div className="series-heading">
          <div>
            <h2>Pick your department.</h2>
          </div>
          <p>
            Three collections. Three moods.
            <br />
            One wall with something to say.
          </p>
        </div>
        <div className="series-grid">
          {productSeries.map((series) => (
            <a
              href="#shop"
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

      <section className="social-wall" id="community">
        <div className="social-heading">
          <div>
            <h2>Good walls, great people.</h2>
          </div>
          <div className="social-intro">
            <p>
              Tag <strong>@ODDWALL.STUDIO</strong> for a chance to end up on this very wall.
            </p>
            <a href="#community">
              Follow the chaos <Icon name="arrow" />
            </a>
          </div>
        </div>
        <div className="social-grid">
          {socialPosts.map((post, index) => (
            <a className={`social-post post-${index + 1}`} href="#community" key={post.handle}>
              <img src={post.image} alt={post.alt} />
              <div>
                <strong>{post.handle}</strong>
                <span>VIEW POST →</span>
              </div>
              <small>Photo · {post.credit}</small>
            </a>
          ))}
          <blockquote>
            <div>★★★★★</div>
            <p>“The print quality is unreal. My blank wall finally has a personality.”</p>
            <cite>— JAMIE, VERIFIED BUYER</cite>
          </blockquote>
        </div>
      </section>

      <section className="journal-section" id="journal">
        <div className="journal-heading">
          <div>
            <h2>Read something strange.</h2>
          </div>
          <a href="#journal">
            View all stories <Icon name="arrow" />
          </a>
        </div>
        <div className="journal-grid">
          {journalPosts.map((post, index) => (
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

      <section className="faq-section" id="faq">
        <div className="faq-heading">
          <h2>Questions, answered.</h2>
          <p>Everything worth knowing before your wall gets louder.</p>
        </div>
        <div className="faq-card-grid">
          {faqItems.map((item, index) => (
            <article className={`faq-card faq-card-${(index % 3) + 1}`} key={item.question}>
              <div className="faq-card-top">
                <span>0{index + 1}</span>
                <Icon name="arrow" />
              </div>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-section" id="about">
        <div className="about-image">
          <img
            src="https://images.unsplash.com/photo-1663433567177-9f94be0bff4c?auto=format&fit=crop&w=1500&q=90"
            alt="Independent print studio production process"
          />
          <small>Photo · Anthony Roberts</small>
        </div>
        <div className="about-copy">
          <span>ABOUT ODD WALL</span>
          <h2>Ideas belong out in the open.</h2>
          <p>
            We are an independent print studio turning philosophy, satire, and cult energy into art
            for everyday spaces. Every edition is made in small runs, on archival paper, with enough
            personality to start a conversation.
          </p>
          <a href="#shop">
            MEET THE PRINTS <Icon name="arrow" />
          </a>
        </div>
      </section>

      <section className="trust-section" aria-label="Why shop with Odd Wall">
        <div className="trust-score">
          <span>TRUST THE PROCESS</span>
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

      <footer>
        <div className="footer-grid">
          <div className="footer-info">
            <div className="footer-logo">
              ODD WALL<span>!</span>
            </div>
            <p>
              Independent art prints for loud minds, blank walls, and people who think a little
              sideways.
            </p>
            <div className="footer-newsletter">
              <span>GOOD STUFF, OCCASIONALLY.</span>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setToast("You're in. Stay odd!");
                }}
              >
                <input
                  type="email"
                  required
                  placeholder="Your email address"
                  aria-label="Email address"
                />
                <button aria-label="Subscribe">
                  <Icon name="arrow" />
                </button>
              </form>
            </div>
          </div>
          <nav className="footer-column" aria-label="Shop">
            <span>01 / SHOP</span>
            <a href="#shop">All posters</a>
            <a href="#shop" onClick={() => setFilter("Philosophy")}>
              Philosophy
            </a>
            <a href="#shop" onClick={() => setFilter("Satire")}>
              Satire
            </a>
            <a href="#shop" onClick={() => setFilter("Icons")}>
              Cult icons
            </a>
            <a href="#shop">New drops</a>
          </nav>
          <nav className="footer-column" aria-label="Information">
            <span>02 / INFO</span>
            <a href="#manifesto">Events</a>
            <a href="#top">Print quality</a>
            <a href="#top">Shipping & returns</a>
            <a href="#faq">FAQ</a>
            <a href="#about">About us</a>
          </nav>
          <nav className="footer-column" aria-label="Social media">
            <span>03 / FOLLOW</span>
            <a href="#top">Instagram →</a>
            <a href="#top">TikTok →</a>
            <a href="#top">Pinterest →</a>
            <a href="#top">Spotify →</a>
          </nav>
        </div>
        <div className="footer-bottom">
          <span>© 2026 ODD WALL STUDIO</span>
          <span>PRINTED WITH CARE. SHIPPED WORLDWIDE.</span>
          <a href="#top">Back to top ↑</a>
        </div>
      </footer>

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
    </main>
  );
}
