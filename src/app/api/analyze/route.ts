import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

function buildPrompt(logs: Array<{ distance: number; createdAt: Date | string }>) {
  const summary = logs
    .slice()
    .reverse()
    .map((log, index) => {
      const time = new Date(log.createdAt).toLocaleString();
      return `${index + 1}. ${time} — ${log.distance}cm`;
    })
    .join("\n");

  return `Analyze the user's posture trend using these latest readings (lower is better, and threshold for poor posture is 35cm):\n\n${summary}\n\nPlease write a short analysis in exactly 2 paragraphs. The first paragraph should explain the trend, the frequency of readings below the 35cm threshold, and whether posture is improving or worsening overall. The second paragraph should provide 2 ergonomic stretch recommendations tailored to the user's pattern. Keep it practical, concise, and readable.`;
}

export async function GET() {
  return POST();
}

export async function POST() {
  try {
    const logs = await prisma.postureLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    if (!logs.length) {
      return NextResponse.json({
        analysis:
          "Not enough posture data yet. Log a few posture readings first so I can generate a trend summary.",
      });
    }

    const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        analysis:
          "AI analysis is unavailable because no Google API key is configured. Add GOOGLE_API_KEY or GEMINI_API_KEY to enable posture insights.",
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = buildPrompt(
      logs.map((log) => ({
        distance: log.distance,
        createdAt: log.createdAt,
      })),
    );

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const analysis = response.text?.trim();

    if (!analysis) {
      return NextResponse.json({
        analysis:
          "Unable to generate a posture summary right now. Please try again in a moment.",
      });
    }

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error("AI posture analysis failed:", error);
    return NextResponse.json(
      {
        analysis:
          "I couldn’t generate the summary because the analysis service is unavailable. Please try again shortly.",
      },
      { status: 500 },
    );
  }
}
