import { BottomLeftPanel } from "@/components/bottom-left-panel";
import { BottomRightPanel } from "@/components/bottom-right-panel";
import { TopPanel } from "@/components/top-panel";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <div className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-orange-500 text-sm font-bold text-slate-950">
              P
            </div>
            <div>
              <div className="text-sm font-semibold tracking-wide text-white">Posture</div>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
            <span>Overview</span>
            <span>Telemetry</span>
            <span>Insights</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-6 px-6 py-6">
        <div className="grid gap-6">
          <TopPanel />

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <BottomLeftPanel />
            <BottomRightPanel />
          </div>
        </div>
      </div>
    </main>
  );
}
