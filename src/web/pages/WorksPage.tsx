import { FilterPills } from "../components/FilterPills";
import { WorkCard } from "../components/WorkCard";
import { WORK_TYPE, type Work, type WorkType } from "../types/workTypes";

// Server-rendered page. Filtering is a link back to this same page
// (/works?type=…); the server handler calls the works service directly
// with the filter and renders the result — no API, no client fetch.
export function WorksPage({
  works,
  selectedType,
  nextCursor,
}: {
  works: Work[];
  selectedType: WorkType | "";
  nextCursor: string | null;
}) {
  const options = [
    { label: "All", href: "/works", selected: selectedType === "" },
    ...Object.values(WORK_TYPE).map((type) => ({
      label: type.charAt(0) + type.slice(1).toLowerCase(),
      href: `/works?type=${type}`,
      selected: selectedType === type,
    })),
  ];

  const nextHref = nextCursor
    ? `/works?${selectedType ? `type=${selectedType}&` : ""}cursor=${encodeURIComponent(nextCursor)}`
    : null;

  return (
    <main className="page">
      <h1>Works</h1>
      <FilterPills options={options} />
      {works.length === 0 && (
        <p className="message">No published works in this category yet.</p>
      )}
      {works.length > 0 && (
        <div className="works-grid">
          {works.map((work) => (
            <WorkCard key={work.id} work={work} />
          ))}
        </div>
      )}
      {nextHref && (
        <p className="message">
          <a href={nextHref}>Next page →</a>
        </p>
      )}
    </main>
  );
}
