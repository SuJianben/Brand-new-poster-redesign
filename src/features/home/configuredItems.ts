type Block = { settings: Record<string, unknown>; image: string | null };

// Editor blocks are explicit: an empty array means all items were removed.
export function configuredItems<T extends object>(settings: Record<string, string | undefined>, defaults: T[]): Array<T & { link_url?: string }> {
  if (settings._blocks === undefined) return defaults;
  try {
    const blocks = JSON.parse(settings._blocks) as Block[];
    return blocks.map((block) => ({ ...block.settings, ...(block.image ? { image: block.image } : {}) }) as T & { link_url?: string });
  } catch {
    return defaults;
  }
}
