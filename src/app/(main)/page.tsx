"use client";

import Hero from "@/components/portfolio/hero";
import TechStack from "@/components/portfolio/tech-stack";
import Projects from "@/components/portfolio/projects";
import Experience from "@/components/portfolio/experience";
import Blog from "@/components/portfolio/blog";
import Contact from "@/components/portfolio/contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TechStack />
      <Projects />
      <Experience />
      <Blog />
      <Contact />
    </>
  );
}
