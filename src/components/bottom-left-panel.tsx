"use client";

import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type PostureEntry = {
  id: string;
  distance: number;
  createdAt: string;
};

const formatLabel = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
});

export function BottomLeftPanel() {
  const [data, setData] = useState<PostureEntry[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch("/api/data");
        if (!response.ok) return;
        const entries = (await response.json()) as PostureEntry[];

        const nextData = entries
          .slice()
          .reverse()
          .map((entry) => ({
            ...entry,
            label: formatLabel.format(new Date(entry.createdAt)),
            distance: Number(entry.distance),
          }));

        setData(nextData);
      } catch {
        // No-op: keep the previous chart state if polling fails.
      }
    };

    void loadData();
    const interval = setInterval(() => {
      void loadData();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-md bg-slate-800 p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Live telemetry
          </h2>
          <p className="mt-2 text-sm text-white">Posture signal</p>
        </div>
        <span className="rounded-md bg-slate-700/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-300">
          Live
        </span>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
            <CartesianGrid stroke="#333" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
            />
            <YAxis
              domain={[0, 100]}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
            />
            <Tooltip
              formatter={(value) => {
                const numericValue = Array.isArray(value) ? value[0] : value ?? 0;
                return [`${numericValue} cm`, "Distance"] as [string, string];
              }}
              labelStyle={{ color: "#f8fafc" }}
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid #334155",
                borderRadius: 8,
              }}
            />
            <ReferenceLine y={35} stroke="#f97316" strokeDasharray="4 4" ifOverflow="extendDomain" />
            <Line
              type="monotone"
              dataKey="distance"
              stroke="#fbbf24"
              strokeWidth={2.5}
              dot={{ r: 0 }}
              activeDot={{ r: 4, fill: "#fbbf24" }}
              isAnimationActive
              animationDuration={500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
