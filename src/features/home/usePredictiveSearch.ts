import { useEffect, useState } from "react";

export type SearchSuggestion = { title: string; url: string; image?: string; kind: "product" | "query" };
type SearchResource = { text?: string; title?: string; url?: string; image?: string };
type SearchResponse = { resources?: { results?: { products?: SearchResource[]; queries?: SearchResource[] } } };

export function usePredictiveSearch(term: string, enabled: boolean, root: string) {
  const [items, setItems] = useState<SearchSuggestion[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  useEffect(() => {
    const query = term.trim();
    if (!enabled || !query) { setItems([]); setStatus("idle"); return; }
    const controller = new AbortController();
    setItems([]);
    setStatus("loading");
    const timer = window.setTimeout(async () => {
      try {
        const params = new URLSearchParams({ q: query, "resources[type]": "product,query", "resources[limit]": "5", "resources[limit_scope]": "each" });
        const response = await fetch(`${root.replace(/\/$/, "")}/search/suggest.json?${params}`, { signal: controller.signal });
        if (!response.ok) throw new Error("Search suggestions unavailable");
        const data: SearchResponse = await response.json();
        const results = data.resources?.results;
        const queries: SearchSuggestion[] = (results?.queries || []).filter(item => !!item.text).slice(0, 3).map(item => ({ title: item.text!, url: `${root.replace(/\/$/, "")}/search?q=${encodeURIComponent(item.text!)}`, kind: "query" }));
        const products: SearchSuggestion[] = (results?.products || []).filter(item => !!item.title && !!item.url).slice(0, 4).map(item => ({ title: item.title!, url: item.url!, image: item.image, kind: "product" }));
        if (!controller.signal.aborted) { setItems([...queries, ...products]); setStatus("ready"); }
      } catch {
        if (!controller.signal.aborted) { setItems([]); setStatus("error"); }
      }
    }, 250);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [term, enabled, root]);
  return { items, status };
}
