interface NotesStepProps {
  value: string;
  onChange: (value: string) => void;
}

const MAX_LENGTH = 300;

export default function NotesStep({ value, onChange }: NotesStepProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Anything else?
      </h2>
      <p className="text-gray-500 mb-6">
        Optional notes or special instructions for the theme generator.
      </p>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, MAX_LENGTH))}
        placeholder="e.g., Include a testimonials section, use dark backgrounds, make the footer minimal..."
        rows={4}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
        maxLength={MAX_LENGTH}
      />
      <div className="mt-1 text-sm text-gray-400 text-right">
        {value.length}/{MAX_LENGTH}
      </div>
    </div>
  );
}
