"use client";

import { useState } from "react";
import { analyzeResumeAction } from "./actions/analyze";
import {  Cpu, RefreshCcw } from "lucide-react"; 
import AnalysisResults from "@/components/features/AnalysisResults"; 

export default function Home() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = await analyzeResumeAction(formData);
    setResult(data);
    setLoading(false);
  }

  // Helper to reset for a "New Analysis"
  const resetAnalysis = () => setResult(null);

  return (
    <main className="min-h-screen bg-[#0f0a1f] text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 text-center relative">
          {/* Badge from your screenshot */}
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-[10px] text-violet-300 mb-4">
            <Cpu size={12} /> 2026 AI Engine Enabled
          </div>

          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-violet-400 to-fuchsia-300 bg-clip-text text-transparent">
            AI Career Copilot
          </h1>
          <p className="text-gray-400 mt-3 text-lg">
            Bridge the gap between your resume and your dream internship.
          </p>

          {/* New Analysis Button (Visible only when result exists) */}
          {result && (
            <button
              onClick={resetAnalysis}
              className="mt-6 flex items-center gap-2 mx-auto px-4 py-2 bg-[#1a142e] border border-violet-500/30 rounded-full text-sm text-violet-300 hover:bg-violet-500/10 transition-all"
            >
              <RefreshCcw size={16} /> New Analysis
            </button>
          )}
        </header>

        {/* Show Form only if no result, or show Results if they exist */}
        {!result ? (
          <form
            onSubmit={handleUpload}
            className="space-y-6 bg-[#1a142e] p-8 rounded-3xl border border-violet-500/20 shadow-2xl"
          >
            <div>
              <label className="block text-sm font-medium text-violet-300 mb-3">
                Upload Resume (PDF)
              </label>
              <div className="relative group">
                <input
                  type="file"
                  name="resume"
                  accept=".pdf"
                  required
                  className="w-full text-sm text-gray-400 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-violet-600 file:text-white hover:file:bg-violet-500 cursor-pointer bg-[#0f0a1f] border border-violet-500/20 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-violet-300 mb-3">
                Target Job Description
              </label>
              <textarea
                name="jd"
                rows={6}
                required
                className="w-full bg-[#0f0a1f] border border-violet-500/20 rounded-2xl p-5 focus:ring-2 focus:ring-violet-500 focus:outline-none placeholder:text-gray-700 transition-all"
                placeholder="Paste the internship description here to find skill gaps..."
              />
            </div>

            <button
              disabled={loading}
              className="w-full py-5 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl font-bold text-lg hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 shadow-lg shadow-violet-500/20"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing Alignment...
                </span>
              ) : (
                <>
                  <Cpu size={22} /> Analyze Alignment
                </>
              )}
            </button>
          </form>
        ) : (
         
          <AnalysisResults data={result} />
        )}
      </div>
    </main>
  );
}
