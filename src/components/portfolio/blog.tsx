"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";

const blogPosts = [
  {
    title: "Building Scalable Web Apps with Next.js",
    excerpt:
      "Lessons learned from building production applications with the React framework.",
    category: "Dev",
    date: "Mar 15, 2026",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=700&q=80",
    slug: "building-scalable-web-apps",
  },
  {
    title: "Why Supabase is My Go-To Backend",
    excerpt:
      "Exploring the power of open-source Firebase alternative for modern web development.",
    category: "Backend",
    date: "Feb 28, 2026",
    image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=700&q=80",
    slug: "why-supabase",
  },
  {
    title: "Designing for Performance and Accessibility",
    excerpt:
      "How to build interfaces that are both fast and inclusive without compromise.",
    category: "Design",
    date: "Jan 20, 2026",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=700&q=80",
    slug: "designing-for-performance",
  },
];

export default function Blog() {
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
    <section id="blog" ref={sectionRef} className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
          <div>
            <p className="reveal text-xs font-medium text-primary tracking-widest uppercase mb-3">
              Thoughts
            </p>
            <h2 className="reveal d1 font-display font-bold text-4xl md:text-5xl text-foreground">
              From the blog
            </h2>
          </div>
          <Link
            href="/CustomerSide/Blogs"
            className="reveal d1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors self-start sm:self-auto nl"
          >
            All articles →
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {blogPosts.map((post, i) => (
            <article
              key={post.slug}
              className={`reveal d${i + 1} card-h group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary transition-all`}
            >
              <div className="w-full h-44 overflow-hidden bg-muted">
                <Image
                  src={post.image}
                  alt={post.title}
                  width={700}
                  height={352}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full">
                    {post.category}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {post.date}
                  </span>
                </div>
                <h3 className="font-display font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {post.excerpt}
                </p>
                <Link
                  href="/CustomerSide/Blogs"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground nl"
                >
                  Read more →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
