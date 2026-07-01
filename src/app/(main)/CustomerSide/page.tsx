"use client";

import Hero from "@/components/portfolio/hero";
import TechStack from "@/components/portfolio/tech-stack";
import Projects from "@/components/portfolio/projects";
import Experience from "@/components/portfolio/experience";
import Contact from "@/components/portfolio/contact";

export default function CustomerHomePage() {
  return (
    <>
      <Hero />
      <TechStack />
      <Projects />
      <Experience />
      <Contact />
    </>
  );
}
