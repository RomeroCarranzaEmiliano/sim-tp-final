"use client";

import HomeView from "@/components/home.view";
import { SimProvider } from "@/hooks/useSim";

export default function Home() {
  return (
    <SimProvider>
      <HomeView />
    </SimProvider>
  );
}
