interface SelectableCardProps {
  label: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
}

export default function SelectableCard({
  label,
  description,
  selected,
  onClick,
}: SelectableCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-5 py-5 rounded-xl text-left transition-all duration-200 cursor-pointer border ${
        selected
          ? "bg-surface-selected border-border-active scale-[1.02] shadow-lg shadow-accent/10"
          : "bg-surface-raised border-border-subtle hover:bg-surface-hover hover:border-border-active/30 hover:scale-[1.01]"
      }`}
    >
      <div className={`text-base font-semibold mb-1 ${selected ? "text-accent" : "text-text-primary"}`}>
        {label}
      </div>
      {description && (
        <div className="text-sm text-text-secondary leading-relaxed">{description}</div>
      )}
    </button>
  );
}
