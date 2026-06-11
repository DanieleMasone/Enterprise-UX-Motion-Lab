export interface SegmentedOption<TValue extends string> {
  label: string;
  value: TValue;
}

export interface SegmentedControlProps<TValue extends string> {
  ariaLabel: string;
  value: TValue;
  options: SegmentedOption<TValue>[];
  onChange: (value: TValue) => void;
}

/**
 * Accessible segmented control used for compact enterprise state switches.
 */
export function SegmentedControl<TValue extends string>({
  ariaLabel,
  value,
  options,
  onChange
}: SegmentedControlProps<TValue>) {
  return (
    <div className="segmented-control" role="group" aria-label={ariaLabel}>
      {options.map((option) => (
        <button
          aria-pressed={option.value === value}
          className="segmented-control__item"
          key={option.value}
          onClick={() => onChange(option.value)}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
