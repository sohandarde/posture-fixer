"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

export async function submitPostureLog(formData: FormData) {
  const rawDistance = Number(formData.get("distance"));
  const distance = Number.isFinite(rawDistance) ? Math.round(rawDistance) : null;

  if (!distance || distance < 5 || distance > 100) {
    return;
  }

  await prisma.postureLog.create({
    data: {
      distance,
    },
  });

  revalidatePath("/");
  redirect("/");
}
