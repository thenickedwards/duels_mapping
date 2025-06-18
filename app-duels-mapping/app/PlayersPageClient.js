"use client";

import { useSearchParams } from "next/navigation";
import PlayersPageCore from "./PlayersPageCore";

export default function PlayersPageClient() {
  const searchParams = useSearchParams();
  return <PlayersPageCore searchParams={searchParams} />;
}
