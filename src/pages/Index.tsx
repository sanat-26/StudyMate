import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { DemoWorkflow } from "@/components/DemoWorkflow";
import { HowItWorks } from "@/components/HowItWorks";
import { Testimonials } from "@/components/Testimonials";
import { About } from "@/components/About";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <DemoWorkflow />
        <HowItWorks />
        <Testimonials />
        <About />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
