import { Button } from "./Button";

export interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

/**
 * Empty state primitive that keeps recovery action close to the missing data.
 */
export function EmptyState({ title, message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <section className="empty-state" aria-live="polite">
      <h2>{title}</h2>
      <p>{message}</p>
      {actionLabel && onAction ? (
        <Button onClick={onAction} variant="primary">
          {actionLabel}
        </Button>
      ) : null}
    </section>
  );
}
