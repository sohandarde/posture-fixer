"use client";

import { useState } from "react";

export function TopPanel() {
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<string>("");

  const handleGenerateReport = async () => {
    setIsLoading(true);
    setReport("");

    try {
      const response = await fetch("/api/analyze", { method: "POST" });
      const data = (await response.json()) as { analysis?: string; error?: string };

      if (!response.ok) {
        throw new Error(data.error || "AI analysis failed.");
      }

      setReport(data.analysis || "AI analysis is unavailable right now.");
    } catch (error) {
      setReport(
        error instanceof Error
          ? error.message
          : "Unable to generate a posture report right now.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const paragraphs = report
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <div className="rounded-md bg-slate-800 p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
            Habit analysis
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Daily alignment overview
          </h1>
        </div>

        <div className="flex items-center gap-3 self-start">
          <div className="flex items-center gap-2 rounded-md bg-slate-700/50 px-3 py-2 text-sm text-slate-300">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            Stable trend
          </div>

          <button
            type="button"
            onClick={handleGenerateReport}
            disabled={isLoading}
            className="rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? "Generating..." : "Generate AI Report"}
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          { label: "Average posture gap", value: "28cm", accent: "text-white" },
          { label: "Best session", value: "18cm", accent: "text-orange-500" },
          { label: "Recovery score", value: "91%", accent: "text-white" },
        ].map((item) => (
          <div key={item.label} className="rounded-md bg-slate-900 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
              {item.label}
            </p>
            <p className={`mt-3 text-2xl font-semibold ${item.accent}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {isLoading && (
        <div className="mt-6 flex items-center gap-3 rounded-md bg-slate-900 p-4 text-sm text-slate-300">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-transparent" />
          Analysing your latest posture data...
        </div>
      )}

      {!isLoading && paragraphs.length > 0 && (
        <div className="mt-6 rounded-md bg-slate-900 p-5 text-sm leading-7 text-slate-300">
          {paragraphs.map((paragraph, index) => (
            <p key={`${paragraph.slice(0, 20)}-${index}`} className="mb-4 last:mb-0 text-slate-300">
              {paragraph}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
