import Hero from "@/components/sections/Hero";
import Doctor from "@/components/sections/Doctor";
import Approche from "@/components/sections/Approche";
import Services from "@/components/sections/Services";
import BeforeAfter from "@/components/sections/BeforeAfter";
import Cabinet from "@/components/sections/Cabinet";
import Testimonials from "@/components/sections/Testimonials";
import Appointment from "@/components/sections/Appointment";

export default function Home() {
  return (
    <>
      <Hero />
      <Doctor />
      <Approche />
      <Services />
      <BeforeAfter />
      <Cabinet />
      <Testimonials />
      <Appointment />
    </>
  );
}
