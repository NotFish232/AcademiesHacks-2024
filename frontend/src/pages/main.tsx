import { About } from "@/components/otherstuff/About";
import { Cta } from "@/components/otherstuff/Cta";
import { FAQ } from "@/components/otherstuff/FAQ";
import { Features } from "@/components/otherstuff/Features";
import { Footer } from "@/components/otherstuff/Footer";
import { Hero } from "@/components/otherstuff/Hero";
import { HowItWorks } from "@/components/otherstuff/HowItWorks";
import { Navbar } from "@/components/otherstuff/Navbar";
import { Newsletter } from "@/components/otherstuff/Newsletter";
import { Pricing } from "@/components/otherstuff/Pricing";
import { ScrollToTop } from "@/components/otherstuff/ScrollToTop";
import { Services } from "@/components/otherstuff/Services";
import { Sponsors } from "@/components/otherstuff/Sponsors";
import { Team } from "@/components/otherstuff/Team";
import { Testimonials } from "@/components/otherstuff/Testimonials";

export default function MainPage() {
  return (
    <>
      <p>Testing</p>
        <Navbar />
        <Hero />
        <Sponsors />
        <About />
        <HowItWorks />
        <Features />
        <Services />
        <Cta />
        <Testimonials />
        <Team />
        <Pricing />
        <Newsletter />
        <FAQ />
        <Footer />
        <ScrollToTop />
    </>
  )
}
