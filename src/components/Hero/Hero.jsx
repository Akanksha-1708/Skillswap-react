// framer motion is a lib for animation to react components, with framer we write <motion.div> instead of <div>


import {motion} from "framer-motion";
import {Button} from "@/components/ui/button";
import StatsCard from "../Stats/StatsCard";
import {Users,BookOpen,Repeat,} from "lucide-react";

function Hero(){
    return (
    <section className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl flex-col items-center justify-between gap-16 px-6 py-20 lg:flex-row">

      <motion.div
        initial={{ opacity: 0, x: -80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl">

        <span className="rounded-full border border-blue-400/40 bg-blue-500/10 px-4 py-2 text-sm text-blue-200">
          🚀 Learn • Teach • Grow
        </span>

        <h1 className="mt-8 text-6xl font-extrabold leading-tight text-white lg:text-7xl">
          Exchange Skills.
          <br />
          <span className="text-blue-400">
            Learn Everything.
          </span>
        </h1>

        <p className="mt-8 text-xl leading-9 text-blue-100">
          Teach what you know and learn what you love.
          <br />
          Connect with passionate learners around the world.
        </p>

        <div className="mt-10 flex flex-wrap gap-5">

          <Button className="h-14 rounded-xl bg-blue-500 px-8 text-lg font-semibold hover:bg-blue-600">
            Get Started
          </Button>

          <Button variant="outline" size="lg" className="h-14 rounded-xl border-2 border-blue-400 px-8 text-lg font-semibold text-blue-200 hover:bg-blue-500 hover:text-white">
            Browse Skills
          </Button>

        </div>

        <div className="mt-16 flex flex-wrap gap-6">
            <StatsCard 
            icon={<Users size={30}/>}  
            number="10K+"
            label="Active Learners"
            />

            <StatsCard 
            icon={<BookOpen size={30}/>}  
            number="500+"
            label="Skills"
            />

            <StatsCard 
            icon={<Repeat size={30}/>}  
            number="25K+"
            label="Skill Swaps"
            />
        </div>

      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.5}}
        className="relative">

        <div className="absolute -inset-8 rounded-full bg-blue-500/20 blur-3xl"></div>

        <img
          src="https://illustrations.popsy.co/gray/studying.svg"
          alt="Hero"
          className="relative w-full max-w-lg"/>

      </motion.div>

    </section>
  );
}

export default Hero;