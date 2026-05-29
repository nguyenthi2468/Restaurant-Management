import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import FeaturedMenu from "@/components/sections/FeaturedMenu";
import Gallery from "@/components/sections/Gallery";
import Hero from "@/components/sections/Hero";
import MenuCategories from "@/components/sections/MenuCategories";
import Services from "@/components/sections/Services";

export default function Home() {
  return (
       <div className="w-full min-h-screen bg-background">
       <Hero />
        <About />
      <FeaturedMenu />
      <MenuCategories />
      <Services />
      <Contact />
      </div>
  );
}
