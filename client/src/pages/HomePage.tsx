import { CTA } from "../components/home/CTA";
import { DashboardPreview } from "../components/home/DashboardPreview";
import { Features } from "../components/home/Features";
import { Footer } from "../components/home/Footer";
import { Hero } from "../components/home/Hero";
import { HowItWorks } from "../components/home/HowItWorks";


export function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] text-gray-900 dark:text-white">
      <main className="max-w-7xl mx-auto px-6">
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