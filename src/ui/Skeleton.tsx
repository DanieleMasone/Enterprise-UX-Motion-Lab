export interface SkeletonBlockProps {
  rows?: number;
  label?: string;
}

/**
 * Skeleton state for perceived performance without generic spinners.
 */
export function SkeletonBlock({ rows = 5, label = "Loading operational risk data" }: SkeletonBlockProps) {
  return (
    <div aria-label={label} className="skeleton" role="status">
      {Array.from({ length: rows }).map((_, index) => (
        <div className="skeleton__row" key={index}>
          <span className="skeleton__cell skeleton__cell--wide" />
          <span className="skeleton__cell" />
          <span className="skeleton__cell" />
          <span className="skeleton__cell skeleton__cell--short" />
        </div>
      ))}
    </div>
  );
}
