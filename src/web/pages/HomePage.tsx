import { Link } from "react-router-dom";
import { ContentRow } from "../components/ContentRow";
import type { Work } from "../types/workTypes";

// Server-rendered page. The data arrives as a prop from the server
// handler, which obtained it by calling the works service directly in
// the same process — this component never fetches anything.
export function HomePage({ works }: { works: Work[] }) {
  const featuredWork = works[0];
  if (!featuredWork)
    return (
      <main className="page">
        <p className="page message">No published works yet.</p>
      </main>
    );

  const heroImage = featuredWork.coverUrl ?? featuredWork.thumbnailUrl;
  const heroStyle = heroImage
    ? { backgroundImage: `url(${heroImage})` }
    : { background: "linear-gradient(120deg,#1d2430,#0f1115)" };
  return (
    <main className="page">
      <section className="hero" style={heroStyle}>
        <div className="hero-content">
          <small>Golden Voice {featuredWork.type.toLowerCase()}</small>
          <h1>{featuredWork.title}</h1>
          {featuredWork.description && <p>{featuredWork.description}</p>}
          <div className="hero-actions">
            <Link className="button-primary" to={`/works/${featuredWork.id}`}>
              Watch now
            </Link>
            <Link className="button-secondary" to="/works">
              Explore
            </Link>
          </div>
        </div>
      </section>
      <ContentRow title="Featured works" works={works} />
    </main>
  );
}
