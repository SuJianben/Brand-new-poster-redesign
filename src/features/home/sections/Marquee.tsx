import { Icon } from "../Icon";

type Settings = Record<string, string | undefined>;
export function Marquee({ settings = {} }: { settings?: Settings }) {

  return (
    <>
      <div className="marquee" aria-hidden="true">
        <div>
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i}>
              {settings.line_one ?? "PHILOSOPHY LEFT THE LIBRARY"} <Icon name="star" /> {settings.line_two ?? "MAKE YOUR WALL TALK"}{" "}
              <Icon name="star" />
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
