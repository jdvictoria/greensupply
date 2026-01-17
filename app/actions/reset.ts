"use client";

import { resetAllData } from "@/lib/storage";

export async function resetDataAction(): Promise<void> {
  resetAllData();
}
