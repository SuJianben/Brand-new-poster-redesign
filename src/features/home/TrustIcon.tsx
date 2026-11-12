import type { ReactNode } from "react";

export type TrustIconName = "paper" | "leaf" | "shipping" | "return";
const icons: Record<TrustIconName, ReactNode> = {
  paper: <><path d="M6 3h9l3 3v15H6z"/><path d="M14 3v4h4M9 11h6M9 15h6"/></>,
  leaf: <><path d="M20 4C10 4 5 8 5 14a5 5 0 0 0 5 5c6 0 10-5 10-15Z"/><path d="M4 21c3-5 6-8 12-11"/></>,
  shipping: <><path d="M3 6h11v11H3zM14 10h4l3 3v4h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></>,
  return: <><path d="M4 11a8 8 0 1 1 2 6"/><path d="M4 5v6h6"/></>,
};

export function TrustIcon({ name }: { name: TrustIconName }) {
  return <svg className="trust-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[name] ?? icons.paper}</svg>;
}
