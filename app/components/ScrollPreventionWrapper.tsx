"use client";

import { useScrollPrevention } from "@/app/hooks/useScrollPrevention";

export default function ScrollPreventionWrapper() {
  useScrollPrevention();
  return null;
}