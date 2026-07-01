"use client";

import { useEffect, useRef } from "react";

const services = [
  {
    title: "UI/UX Design",
    description:
      "From wireframes to polished Figma prototypes. Intuitive, visually compelling interfaces that convert visitors into users and put usability first.",
    icon: (
      <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2" />
      </svg>
    ),
  },
  {
    title: "Frontend Development",
    description:
      "Production-grade code with Next.js, React, and Tailwind CSS. Pixel-perfect, fully responsive, SEO-friendly and blazing fast.",
    icon: (
      <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    title: "Full Stack Solutions",
    description:
      "End-to-end applications with Supabase, PostgreSQL, and modern APIs. Scalable architecture from database design to deployment.",
    icon: (
      <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
      </svg>
    ),
  },
];

export default function TechStack() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    if (sectionRef.current) {
      sectionRef.current.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    }
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="py-24 bg-muted/30 dark:bg-zinc-900/40"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-14">
          <p className="reveal text-xs font-medium text-primary tracking-widest uppercase mb-3">
            What I do
          </p>
          <h2 className="reveal d1 font-display font-bold text-4xl md:text-5xl text-foreground">
            Services
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <article
              key={service.title}
              className={`reveal d${i + 1} card-h group rounded-2xl p-8 border border-border hover:border-primary transition-all ${
                i === 1
                  ? "bg-foreground dark:bg-zinc-800 text-background dark:text-white"
                  : "bg-card text-card-foreground"
              }`}
            >
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-xl mb-6 group-hover:bg-primary/10 transition-colors ${
                  i === 1
                    ? "bg-zinc-800 dark:bg-zinc-700"
                    : "bg-muted"
                }`}
              >
                {service.icon}
              </div>
              <h3
                className={`font-display font-bold text-xl mb-3 ${
                  i === 1 ? "text-white" : "text-foreground"
                }`}
              >
                {service.title}
              </h3>
              <p
                className={`text-sm leading-relaxed ${
                  i === 1
                    ? "text-zinc-400"
                    : "text-muted-foreground"
                }`}
              >
                {service.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
