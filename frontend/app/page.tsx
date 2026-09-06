import CTA from "@/components/landing/CTA";
import FeaturedTools from "@/components/landing/FeaturedTools";
import Footer from "@/components/landing/Footer";
import Hero from "@/components/landing/hero";
import HowItWorks from "@/components/landing/howWorks";
import Navbar from "@/components/landing/navbar";
import Stats from "@/components/landing/stats";
import WhyToolShare from "@/components/landing/WhyToolShare";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#090a0c] text-white">
      <Navbar></Navbar>
      <Hero></Hero>
      <Stats></Stats>
      <HowItWorks></HowItWorks>
      <FeaturedTools></FeaturedTools>
      <WhyToolShare></WhyToolShare>
      <CTA></CTA>
      <Footer></Footer>
    </main>
  );
}
