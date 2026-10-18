// Direct-connection filter: each pill is a plain link to the same page
// with a different ?type= — the server re-renders the page with the
// filtered data. No client JavaScript, no fetch, no API call.
interface FilterPillsProps {
  options: { label: string; href: string; selected: boolean }[];
}

export function FilterPills({ options }: FilterPillsProps) {
  return (
    <div className="filter-pills">
      {options.map((option) => (
        <a
          key={option.href}
          href={option.href}
          className="filter-pill"
          aria-pressed={option.selected}
        >
          {option.label}
        </a>
      ))}
    </div>
  );
}
