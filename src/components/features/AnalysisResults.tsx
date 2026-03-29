import { AlertCircle, BookOpen, BrainCircuit, Target } from "lucide-react";

interface ResultsProps {
  data: {
    score: number;

    missingSkills: string[];

    questions: string[];
  };
}

export default function AnalysisResults({ data }: ResultsProps) {
  return (
    <div className="mt-12 space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* 1. Score Circle & Summary */}

      <div className="flex flex-col md:flex-row gap-6 items-center bg-[#1a142e] p-8 rounded-3xl border border-violet-500/20">
        <div className="relative flex items-center justify-center">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="58"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-violet-900/30"
            />

            <circle
              cx="64"
              cy="64"
              r="58"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={364.4}
              strokeDashoffset={364.4 - (364.4 * data.score) / 100}
              className="text-violet-500 transition-all duration-1000 ease-out"
            />
          </svg>

          <span className="absolute text-3xl font-bold">{data.score}%</span>
        </div>

        <div className="text-center md:text-left">
          <h3 className="text-2xl font-bold flex items-center gap-2 justify-center md:justify-start">
            <Target className="text-fuchsia-400" /> Match Analysis
          </h3>

          <p className="text-gray-400 mt-1">
            Based on AI screening of your technical depth and experience.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 2. Missing Skills (The Gap) */}

        <div className="bg-[#1a142e] p-6 rounded-2xl border border-red-500/10">
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2 text-red-400">
            <AlertCircle size={20} /> Missing Key Skills
          </h4>

          <div className="flex flex-wrap gap-2">
            {data.missingSkills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-300 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* 3. Personalized Questions (The Twist) */}

        <div className="bg-[#1a142e] p-6 rounded-2xl border border-blue-500/10">
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-400">
            <BrainCircuit size={20} /> Practice Questions
          </h4>

          <ul className="space-y-3 text-sm text-gray-300">
            {data.questions.map((q, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-blue-500 font-bold">{i + 1}.</span> {q}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
