interface DescriptionStepProps {
  value: string;
  onChange: (value: string) => void;
}

const MAX_LENGTH = 500;

export default function DescriptionStep({
  value,
  onChange,
}: DescriptionStepProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Describe your site
      </h2>
      <p className="text-gray-500 mb-6">
        What vibe, tone, or feel are you going for? Be as specific as you like.
      </p>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, MAX_LENGTH))}
        placeholder="e.g., A dark mode blog for photographers with a large, centered hero section and a moody, cinematic feel. Think high contrast blacks and deep blues."
        rows={5}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
        maxLength={MAX_LENGTH}
      />
      <div className="mt-1 text-sm text-gray-400 text-right">
        {value.length}/{MAX_LENGTH}
      </div>
    </div>
  );
}
