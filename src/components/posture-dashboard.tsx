"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { submitPostureLog } from "@/app/actions";

export type LogPoint = {
  id: string;
  distance: number;
  createdAt: string;
};

const formatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

export function PostureDashboard({
  logs,
  insight,
}: {
  logs: LogPoint[];
  insight: string;
}) {
  const chartData = logs.map((log) => ({
    name: formatter.format(new Date(log.createdAt)),
    distance: log.distance,
  }));

  const averageDistance =
    logs.length > 0
      ? Math.round(
          logs.reduce((sum, log) => sum + log.distance, 0) / logs.length,
        )
      : 0;

  const bestDay = logs.length > 0 ? Math.min(...logs.map((log) => log.distance)) : 0;
  const latestDistance = logs.length > 0 ? logs[logs.length - 1].distance : 0;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f5f3ff,_#eef6ff_45%,_#f8fafc_100%)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg shadow-slate-200/60 backdrop-blur md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-600">
              Daily wellness
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Posture Fixer
            </h1>
          </div>
          <div className="rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm text-violet-900">
            <span className="font-semibold">Current trend:</span> {latestDistance <= 25 ? "Strong" : latestDistance <= 40 ? "Improving" : "Needs reset"}
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Average posture gap</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">{averageDistance}cm</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Best alignment</p>
            <p className="mt-3 text-3xl font-bold text-emerald-600">{bestDay}cm</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Latest reading</p>
            <p className="mt-3 text-3xl font-bold text-violet-600">{latestDistance}cm</p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.6fr_0.9fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between"> 
              <h2 className="text-xl font-semibold text-slate-900">Alignment trend</h2>
              <span className="text-sm text-slate-500">Last {logs.length || 0} checks</span>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="distanceFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.08} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                  <Tooltip
                    formatter={(value) => {
                      const numericValue = Array.isArray(value) ? value[0] : value ?? 0;
                      return [`${numericValue}cm`, "Distance"] as [string, string];
                    }}
                    contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="distance"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    fill="url(#distanceFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Quick check-in</h2>
              <p className="mt-1 text-sm text-slate-500">Record your latest posture reading.</p>
            </div>

            <form action={submitPostureLog} className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Distance from ideal posture</span>
                <input
                  name="distance"
                  type="number"
                  min={5}
                  max={100}
                  defaultValue={latestDistance || 28}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-3 text-lg outline-none ring-0 transition focus:border-violet-400 focus:bg-white"
                />
              </label>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-base font-semibold text-white transition hover:bg-slate-800"
              >
                Save check-in
              </button>
            </form>

            <div className="rounded-2xl border border-violet-200 bg-violet-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-700">AI coach</p>
              <p className="mt-3 text-sm leading-6 text-slate-700">{insight}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
