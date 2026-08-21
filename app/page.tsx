// src/app/page.tsx
import Header from '@/components/Navbar';
import {Hero} from '@/components/Hero';
import { Categories } from '@/components/Categories';
import { PromoBanner } from '@/components/PromoBanner';
import { HowItWorks } from '@/components/HowItWorks';
import { Testimonials } from '@/components/Testimonials';
import { Newsletter } from '@/components/Newsletter';
import { Footer } from '@/components/Footer';


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-linear-to-b from-[#eef4ec] to-[#fcfdfa]">
      <Header />
      <main className="grow">
        <Hero />
        <Categories/>
        <PromoBanner/>
        <HowItWorks/>
        <Testimonials/>
        <Newsletter/>
      </main>
      <Footer/>
    </div>
  );
}