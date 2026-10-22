// React never reloads the page. Only the component changes. This is called a Single Page Application (SPA).


import Hero from "../../components/Hero/Hero";
import HowItWorks from "../../components/HowItWorks/HowItWorks";
import PopularSkills from "../../components/PopularSkills/PopularSkills";
import CTA from "../../components/CTA/CTA";
import WhySkillSwap from "../../components/WhySkillSwap/WhySkillSwap";
import Testimonials from "../../components/Testiminials/Testimonials";
import FAQ from "../../components/FAQ/FAQ";
import Newsletter from "@/components/Newsletter/Newsletter";


function Home(){
    return(
        <div className="min-h-screen bg-gradient-to-br from-[#081E4C] via-[#233E88] to-[#475793]">
            <Hero/>
            <HowItWorks/>
            <PopularSkills/>
            <WhySkillSwap/>
            <Testimonials/>
            <FAQ/>
            <CTA/>
            <Newsletter/>
        </div>
    );
}
export default Home;