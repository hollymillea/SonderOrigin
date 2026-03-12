"use client";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Merch } from "@/components/Merch";
import { MicroText } from "@/components/MicroText";
import { Tour } from "@/components/Tour";
import { Video } from "@/components/Video";
import { useHeaderTheme } from "@/hooks/useHeaderTheme";

export default function Home() {
  useHeaderTheme();
  return (
    <div className="helvetica-now-display">
      <Header />
      <Hero />
      <Video />
      {/* <MicroText /> */}
      <div className="texture"></div>
    </div>
  );
}
