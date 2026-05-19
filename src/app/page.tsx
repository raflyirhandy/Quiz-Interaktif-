import Link from "next/link";
import { Metadata } from "next";
import { LandingHero } from "@/components/landing/hero";
import { LandingFeatures } from "@/components/landing/features";
import { LandingSubjects } from "@/components/landing/subjects";
import { LandingCTA } from "@/components/landing/cta";
import { LandingNavbar } from "@/components/landing/navbar";

export const metadata: Metadata = {
  title: "Quiz Anak SD - Platform Belajar Interaktif Menyenangkan",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <LandingNavbar />
      <main>
        <LandingHero />
        <LandingFeatures />
        <LandingSubjects />
        <LandingCTA />
      </main>
      <footer className="py-8 text-center text-sm text-gray-400 border-t border-gray-100 dark:border-slate-800">
        © 2024 Quiz Anak SD. Dibuat dengan ❤️ untuk anak-anak Indonesia.
      </footer>
    </div>
  );
}
