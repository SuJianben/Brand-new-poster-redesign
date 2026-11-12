import { Icon } from "../Icon";

type Settings = Record<string, string | undefined>;
export function About({ settings = {} }: { settings?: Settings }) {

  return (
    <>
      <section className="about-section" id="about">
        <div className="about-image">
          <img
            src={settings.image || "https://images.unsplash.com/photo-1663433567177-9f94be0bff4c?auto=format&fit=crop&w=1500&q=90"}
            alt="Independent print studio production process"
          />
          <small>Photo · Anthony Roberts</small>
        </div>
        <div className="about-copy">
          <span>ABOUT ODD WALL</span>
          <h2>{settings.heading ?? "Ideas belong out in the open."}</h2>
          <p>
            We are an independent print studio turning philosophy, satire, and cult energy into art
            for everyday spaces. Every edition is made in small runs, on archival paper, with enough
            personality to start a conversation.
          </p>
          <a className="primary-cta" href={settings.link_url || "#shop"}>
            MEET THE PRINTS <Icon name="arrow" />
          </a>
        </div>
      </section>
    </>
  );
}
