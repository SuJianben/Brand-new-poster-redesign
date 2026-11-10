import { usePoster } from "../state";
import { Icon } from "../Icon";
export function SearchPanel() {
  const { setFilter, searchOpen, setSearchOpen, search, setSearch, scrolled, searchResults } = usePoster();
  return (<div className={`search-panel ${searchOpen ? "is-open" : ""} ${scrolled ? "is-scrolled" : ""}`} aria-hidden={!searchOpen}>
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
      </div>);
}
