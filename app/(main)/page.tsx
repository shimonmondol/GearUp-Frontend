import Navbar from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Categories } from "@/components/Categories";
import { PromoBanner } from "@/components/PromoBanner";
import { Testimonials } from "@/components/Testimonials";
import { Newsletter } from "@/components/Newsletter";
import { Features } from "@/components/Features";
import { Services } from "@/components/Services";
import { Process } from "@/components/Process";
import { Statistics } from "@/components/Statistics";
import { Faq } from "@/components/Faq";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#fcfdfa] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      <Navbar />
      <Hero />
      <Features/>
      <Categories />
      <Services/>
      <PromoBanner />
      <Process/>
      <Statistics/>
      <Testimonials />
      <Faq/>
      <Newsletter />
      {/* <Footer /> */}
    </main>
  );
}