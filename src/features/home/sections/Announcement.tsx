type Settings = Record<string, string | undefined>;
export function Announcement({ settings = {} }: { settings?: Settings }) {
  return <div className="announcement">
    <span>{settings.announcement ?? "FREE WORLDWIDE SHIPPING OVER $75"}</span>
    <span className="announcement-center">{settings.announcement_center ?? "NEW DROP: THINKING IS A STREET SPORT"}</span>
    <a href={settings.link_url ?? "#shop"}>{settings.link_label ?? "SHOP THE DROP →"}</a>
  </div>;
}
