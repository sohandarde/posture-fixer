"use client";

import { useEffect, useState } from "react";

type PostureEntry = {
  id: string;
  distance: number;
  createdAt: string;
};

const getImageByDistance = (distance: number) => {
  if (distance < 35) {
    return "https://placehold.co/400x400/red/white?text=Leaning+In";
  }

  if (distance >= 35 && distance <= 60) {
    return "https://placehold.co/400x400/green/white?text=Perfect+Posture";
  }

  return "https://placehold.co/400x400/orange/white?text=Slouching+Back";
};

export function BottomRightPanel() {
  const [imageSrc, setImageSrc] = useState<string>(
    "https://placehold.co/400x400/green/white?text=Perfect+Posture",
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch("/api/data");
        if (!response.ok) return;

        const entries = (await response.json()) as PostureEntry[];
        const latestDistance = Number(entries.at(-1)?.distance ?? 50);
        setImageSrc(getImageByDistance(latestDistance));
      } catch {
        // Keep the last valid image if the poll fails.
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Posture avatar
          </h2>
          <p className="mt-2 text-sm text-white">Current alignment snapshot</p>
        </div>
        <span className="text-sm text-slate-300">Live</span>
      </div>

      <div className="mt-5 overflow-hidden rounded-md bg-slate-900 p-3">
        <img
          src={imageSrc}
          alt="Posture state"
          className="h-auto w-full rounded-md object-cover opacity-100 transition-opacity duration-300"
        />
      </div>
    </div>
  );
}
