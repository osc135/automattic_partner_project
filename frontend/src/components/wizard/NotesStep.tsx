interface NotesStepProps {
  value: string;
  onChange: (value: string) => void;
}

const MAX_LENGTH = 300;

export default function NotesStep({ value, onChange }: NotesStepProps) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-text-primary mb-1">
        Anything else?
      </h2>
      <p className="text-base text-text-secondary mb-6">
        Optional. Special instructions or requests.
      </p>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, MAX_LENGTH))}
        placeholder="Dark backgrounds, minimal footer, testimonials section..."
        rows={4}
        className="w-full px-4 py-3 text-base bg-surface-raised border border-border-subtle rounded-lg text-text-primary placeholder-text-muted focus:border-accent focus:outline-none transition-colors resize-none"
        maxLength={MAX_LENGTH}
      />
      <div className="mt-2 text-xs text-text-muted text-right">
        {value.length}/{MAX_LENGTH}
      </div>
    </div>
  );
}
