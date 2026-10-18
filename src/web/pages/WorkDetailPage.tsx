import type { Work } from "../types/workTypes";

// Server-rendered page. The server handler loads the work by calling
// the works service directly and passes it in as a prop.
export function WorkDetailPage({ work }: { work: Work }) {
  const coverUrl = work.coverUrl ?? work.thumbnailUrl;
  const releaseYear = work.releaseDate
    ? `, ${new Date(work.releaseDate).getFullYear()}`
    : "";
  return (
    <main className="page detail">
      <div
        className="detail-cover"
        style={coverUrl ? { backgroundImage: `url(${coverUrl})` } : undefined}
      />
      <div>
        <h1>{work.title}</h1>
        <p className="detail-meta">
          {work.type.toLowerCase()}
          {releaseYear}
        </p>
        {work.description && <p>{work.description}</p>}
      </div>
    </main>
  );
}

export function MessagePage({ message }: { message: string }) {
  return (
    <main className="page">
      <p className="page message">{message}</p>
    </main>
  );
}
