interface DescriptionStepProps {
  value: string;
  onChange: (value: string) => void;
}

const MAX_LENGTH = 500;

export default function DescriptionStep({ value, onChange }: DescriptionStepProps) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-text-primary mb-1">
        Describe your site
      </h2>
      <p className="text-base text-text-secondary mb-6">
        Vibe, tone, feel — be as specific as you want.
      </p>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, MAX_LENGTH))}
        placeholder="A dark mode blog for photographers with a moody, cinematic feel..."
        rows={5}
        className="w-full px-4 py-3 text-base bg-surface-raised border border-border-subtle rounded-lg text-text-primary placeholder-text-muted focus:border-accent focus:outline-none transition-colors resize-none"
        maxLength={MAX_LENGTH}
      />
      <div className="mt-2 text-xs text-text-muted text-right">
        {value.length}/{MAX_LENGTH}
      </div>
    </div>
  );
}
