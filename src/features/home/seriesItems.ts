import { productSeries } from "./data";

type Series = (typeof productSeries)[number] & { id?: string; link_url?: string };
type Block = {
  id: string;
  settings: Partial<Series>;
  image: string | null;
  collection: { title: string; url: string; count: number } | null;
};

export function readSeries(settings: Record<string, string | undefined>): Series[] {
  if (settings._blocks === undefined) return productSeries;
  try {
    const blocks = JSON.parse(settings._blocks) as Block[];
    return blocks.map((block) => {
      const item = block.settings;
      return {
        id: block.id,
        number: item.number || "",
        name: block.collection?.title || item.name || "",
        category: item.category || "",
        count: block.collection ? `${block.collection.count} PRINTS` : item.count || "",
        line: item.line || "",
        color: item.color || "#6c5ce7",
        image: block.image || item.image || "",
        link_url: block.collection?.url || item.link_url || "#shop",
      };
    });
  } catch {
    return productSeries;
  }
}
