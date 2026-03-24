import { useState } from "react";

interface GradeCategory {
  name: string;
  score: number;
  reasoning: string;
}

interface Grade {
  overall_score: number | null;
  overall_summary: string;
  categories: GradeCategory[];
}

interface ThemeGradeProps {
  grade: Grade;
}

function scoreColor(score: number): string {
  if (score >= 80) return "#34d399"; // green
  if (score >= 60) return "#fbbf24"; // yellow
  return "#f87171"; // red
}

function scoreLabel(score: number): string {
  if (score >= 90) return "Exceptional";
  if (score >= 80) return "Great";
  if (score >= 70) return "Good";
  if (score >= 60) return "Average";
  if (score >= 40) return "Below Average";
  return "Poor";
}

function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const color = scoreColor(score);
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="4"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold" style={{ color }}>{score}</span>
      </div>
    </div>
  );
}

function ScoreBar({ score }: { score: number }) {
  const color = scoreColor(score);
  return (
    <div className="flex items-center gap-3 flex-1">
      <div className="flex-1 h-1.5 rounded-full bg-border-subtle overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-sm font-medium w-8 text-right" style={{ color }}>{score}</span>
    </div>
  );
}

export type { Grade };

export default function ThemeGrade({ grade }: ThemeGradeProps) {
  const [expanded, setExpanded] = useState(false);

  if (grade.overall_score === null) return null;

  return (
    <div className="mb-8 bg-surface-raised rounded-xl border border-border-subtle overflow-hidden">
      {/* Header — always visible */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full px-6 py-5 flex items-center gap-6 cursor-pointer hover:bg-surface-hover transition-colors"
      >
        <ScoreRing score={grade.overall_score} />
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg font-semibold text-text-primary">
              Quality Score
            </span>
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{
                color: scoreColor(grade.overall_score),
                backgroundColor: `${scoreColor(grade.overall_score)}15`,
              }}
            >
              {scoreLabel(grade.overall_score)}
            </span>
          </div>
          <p className="text-sm text-text-secondary">{grade.overall_summary}</p>
        </div>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`text-text-muted transition-transform ${expanded ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Expanded breakdown */}
      {expanded && (
        <div className="px-6 pb-6 space-y-4 border-t border-border-subtle pt-5 animate-fade-in">
          {grade.categories.map((cat) => (
            <div key={cat.name}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-medium text-text-primary w-36 flex-shrink-0">
                  {cat.name}
                </span>
                <ScoreBar score={cat.score} />
              </div>
              <p className="text-sm text-text-secondary ml-0 pl-36">
                {cat.reasoning}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
