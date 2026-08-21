import { Hero } from "@/components/Hero";
import { Categories } from "@/components/Categories";
import { PromoBanner } from "@/components/PromoBanner";
import { HowItWorks } from "@/components/HowItWorks";
import { Testimonials } from "@/components/Testimonials";
import { Newsletter } from "@/components/Newsletter";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#fcfdfa] text-zinc-900 font-sans antialiased selection:bg-[#3b663b] selection:text-white">
      <Hero />
      <Categories />
      <PromoBanner />
      <HowItWorks />
      <Testimonials />
      <Newsletter />
    </div>
  );
}