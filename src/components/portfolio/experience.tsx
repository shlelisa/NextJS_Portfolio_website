"use client";

import { useSkills } from "@/lib/queries";
import Image from "next/image";
import { useEffect, useRef } from "react";

export default function Experience() {
  const { data: skills, isLoading } = useSkills();
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

  const defaultSkills = [
    "Next.js", "React", "TypeScript", "Tailwind CSS",
    "Supabase", "PostgreSQL", "Node.js", "Git",
  ];

  const skillList = skills?.length ? skills : defaultSkills;

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-24 bg-muted/30 dark:bg-zinc-900/40"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="reveal order-2 md:order-1">
            <div className="w-full aspect-square max-w-sm mx-auto rounded-3xl overflow-hidden bg-muted">
              <Image
                src="/profile.jpg"
                alt="Lelisa Shashura"
                width={500}
                height={500}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="order-1 md:order-2">
            <p className="reveal text-xs font-medium text-primary tracking-widest uppercase mb-3">
              About me
            </p>
            <h2 className="reveal d1 font-display font-bold text-4xl md:text-5xl text-foreground leading-tight mb-6">
              A bit about
              <br />
              who I am
            </h2>
            <p className="reveal d2 text-muted-foreground leading-relaxed mb-4">
              I&apos;m Lelisa, a Full Stack Developer based in Ethiopia with 3
              years of experience building digital products for businesses. I
              thrive at the intersection of great design and clean code.
            </p>
            <p className="reveal d3 text-muted-foreground leading-relaxed mb-8">
              I believe great interfaces are invisible — they get out of the
              user&apos;s way. My work is fast, accessible, and built to last.
              When I&apos;m not coding, I&apos;m exploring new technologies.
            </p>

            <div className="reveal d4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-3">
                Stack &amp; tools
              </p>
              {isLoading ? (
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <span
                      key={i}
                      className="h-8 w-24 bg-muted rounded-full animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2" role="list" aria-label="Skills">
                  {skillList.map((skill) => (
                    <span
                      key={skill}
                      role="listitem"
                      className="text-sm bg-card border border-border text-muted-foreground px-3.5 py-1.5 rounded-full hover:border-primary hover:text-foreground transition-colors cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
