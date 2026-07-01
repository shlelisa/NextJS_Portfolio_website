"use client";

import { useProjects } from "@/lib/queries";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

export default function Projects() {
  const { data: projects, isLoading } = useProjects();
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
    <section id="work" ref={sectionRef} className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
          <div>
            <p className="reveal text-xs font-medium text-primary tracking-widest uppercase mb-3">
              Portfolio
            </p>
            <h2 className="reveal d1 font-display font-bold text-4xl md:text-5xl text-foreground">
              Selected work
            </h2>
          </div>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`rounded-2xl overflow-hidden bg-muted animate-pulse ${
                  i === 1 ? "md:row-span-2" : ""
                }`}
              >
                <div className={`${i === 1 ? "h-80" : "h-48"} bg-muted"`} />
                <div className="p-7 space-y-3">
                  <div className="h-4 w-24 bg-muted rounded" />
                  <div className="h-6 w-48 bg-muted rounded" />
                  <div className="h-4 w-full bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : !projects?.length ? (
          <p className="text-muted-foreground">Projects coming soon.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {projects.slice(0, 3).map((project, idx) => {
              const techs = project.technology
                ? project.technology.split(",").map((t) => t.trim())
                : [];

              return (
                <article
                  key={project.id}
                  className={`reveal d${idx + 1} card-h group rounded-2xl overflow-hidden bg-card border border-border hover:border-primary transition-all ${
                    idx === 0 ? "md:row-span-2" : ""
                  }`}
                >
                  <div
                    className={`w-full overflow-hidden bg-muted ${
                      idx === 0 ? "h-64 md:h-80" : "h-48"
                    }`}
                  >
                    {project.image_urls?.[0] ? (
                      <Image
                        src={project.image_urls[0]}
                        alt={project.title}
                        width={900}
                        height={idx === 0 ? 640 : 384}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="p-7">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {techs.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="text-xs bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <h3 className="font-display font-bold text-2xl text-foreground mb-2">
                      {project.title}
                    </h3>

                    <p className="text-sm text-muted-foreground leading-relaxed mb-5 line-clamp-3">
                      {project.description}
                    </p>

                    <div className="flex gap-3">
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground nl"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                          </svg>
                          Source
                        </a>
                      )}
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground nl"
                        >
                          Live Demo
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
