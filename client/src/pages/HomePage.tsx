import { CTA } from "../components/home/CTA";
import { DashboardPreview } from "../components/home/DashboardPreview";
import { Features } from "../components/home/Features";
import { Footer } from "../components/home/Footer";
import { Hero } from "../components/home/Hero";
import { HowItWorks } from "../components/home/HowItWorks";


export function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 dark:bg-[#05050a] text-gray-900 dark:text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.16),transparent_45%)] dark:bg-[radial-gradient(circle_at_top,rgba(79,70,229,0.14),transparent_40%)]" />
      <main className="relative max-w-7xl mx-auto px-6">
        <Hero />

        <DashboardPreview />

        <Features />

        <HowItWorks />

        <CTA />
      </main>

      <Footer />
    </div>
  );
}