"use client";

import { useProfile } from "@/lib/queries";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";

export default function Hero() {
  const { data: profile, isLoading } = useProfile();
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
  }, [isLoading]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen flex items-center pt-16 overflow-hidden"
    >
      <div
        className="absolute top-1/4 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/4 left-0 w-64 h-64 bg-muted/50 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="reveal text-sm font-medium text-primary tracking-widest uppercase mb-4">
              {isLoading ? (
                <span className="inline-block w-32 h-4 bg-muted rounded animate-pulse" />
              ) : (
                "Available for work"
              )}
            </p>

            <h1 className="reveal d1 font-display font-bold text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-foreground mb-6">
              {isLoading ? (
                <span className="inline-block w-64 h-14 bg-muted rounded-lg animate-pulse" />
              ) : (
                <>
                  Hi, I&apos;m{" "}
                  <span className="text-primary">
                    {profile?.firstName || "Lelisa"}
                  </span>
                </>
              )}
            </h1>

            <p className="reveal d2 text-lg md:text-xl text-muted-foreground font-light leading-relaxed max-w-md mb-10">
              {isLoading ? (
                <span className="inline-block w-full h-6 bg-muted rounded animate-pulse" />
              ) : (
                <>
                  {profile?.profileTitle || (
                    <>
                      <strong className="font-medium text-foreground">
                        Full Stack Developer
                      </strong>
                      . I design and build digital products that people love to
                      use — fast, clean, and accessible.
                    </>
                  )}
                </>
              )}
            </p>

            <div className="reveal d3 flex flex-wrap gap-4">
              <Link
                href="/#work"
                className="shimmer inline-flex items-center gap-2 bg-foreground dark:bg-white text-background dark:text-zinc-900 font-medium px-7 py-3.5 rounded-full hover:bg-foreground/80 dark:hover:bg-zinc-200 transition-colors text-sm"
              >
                View my work
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </Link>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 border border-border text-muted-foreground font-medium px-7 py-3.5 rounded-full hover:bg-accent transition-colors text-sm"
              >
                Get in touch
              </Link>
            </div>

            <div className="reveal d4 flex gap-8 mt-14 pt-8 border-t border-border">
              <div>
                <p className="font-display font-bold text-3xl text-foreground">
                  10+
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Projects done
                </p>
              </div>
              <div>
                <p className="font-display font-bold text-3xl text-foreground">
                  5+
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Happy clients
                </p>
              </div>
              <div>
                <p className="font-display font-bold text-3xl text-foreground">
                  3y
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Experience
                </p>
              </div>
            </div>
          </div>

          <div className="reveal d2 flex justify-center md:justify-end">
            <div className="relative w-72 h-72 md:w-80 md:h-80 lg:w-96 lg:h-96">
              <div className="w-full h-full rounded-3xl overflow-hidden bg-muted">
                <Image
                  src="/profile.jpg"
                  alt="Lelisa Shashura"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-primary text-primary-foreground font-display font-bold text-sm px-4 py-2.5 rounded-2xl shadow-lg">
                Open to work
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
