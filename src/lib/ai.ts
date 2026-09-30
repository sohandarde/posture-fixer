import { GoogleGenAI } from "@google/genai";

export type PostureLogLike = {
  id: string;
  distance: number;
  createdAt: Date | string;
};

function buildFallbackInsight(logs: PostureLogLike[]) {
  if (!logs.length) {
    return "Start with a quick check-in and set a daily goal to reduce your posture strain.";
  }

  const average =
    logs.reduce((sum, log) => sum + Number(log.distance), 0) / logs.length;
  const latest = Number(logs[logs.length - 1]?.distance ?? 0);

  if (latest <= 25) {
    return "Your alignment is trending in a strong direction. Keep your shoulders relaxed and your screen at eye level.";
  }

  if (latest <= 40) {
    return "You are close to a balanced posture. Try a two-minute stretch break and bring your chin slightly back.";
  }

  return "Your posture is under strain right now. Reset your shoulders, sit taller, and take a brief movement break every 30 minutes.";
}

export async function getPostureInsight(logs: PostureLogLike[]) {
  const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return buildFallbackInsight(logs);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const average =
      logs.reduce((sum, log) => sum + Number(log.distance), 0) / Math.max(logs.length, 1);
    const latest = Number(logs[logs.length - 1]?.distance ?? 0);

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Give a concise posture coaching note for a user with these readings: average distance from ideal alignment ${average.toFixed(1)}cm, latest reading ${latest}cm, and recent data ${logs
        .slice(-5)
        .map((log) => `${new Date(log.createdAt).toLocaleDateString()}:${Number(log.distance)}cm`)
        .join(", ")}. Keep it under 3 sentences and focus on posture habits, desk ergonomics, and a quick daily fix.`,
    });

    const text = response.text?.trim();
    if (text) {
      return text;
    }
  } catch {
    // Fallback gracefully if the AI service is unavailable.
  }

  return buildFallbackInsight(logs);
}
