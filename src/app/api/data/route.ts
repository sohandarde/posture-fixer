import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  const entries = await prisma.postureLog.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 60,
  });

  return NextResponse.json(entries, { status: 200 });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { distance?: number };
    const distance = Number(body?.distance);

    if (!Number.isFinite(distance) || distance < 0 || distance > 100) {
      return NextResponse.json(
        { error: "Distance must be a number between 0 and 100." },
        { status: 400 },
      );
    }

    const newEntry = await prisma.postureLog.create({
      data: {
        distance: Math.round(distance),
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: newEntry,
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload or request failed." },
      { status: 400 },
    );
  }
}
