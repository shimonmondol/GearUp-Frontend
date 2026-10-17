import Navbar from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Categories } from "@/components/Categories";
import { PromoBanner } from "@/components/PromoBanner";
import { HowItWorks } from "@/components/HowItWorks";
import { Testimonials } from "@/components/Testimonials";
import { Newsletter } from "@/components/Newsletter";
// import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#fcfdfa] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      <Navbar />
      <Hero />
      <Categories /><PromoBanner />
      <HowItWorks />
      <Testimonials />
      <Newsletter />
      {/* <Footer /> */}
    </main>
  );
}