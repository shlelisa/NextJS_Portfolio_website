"use client";

import { useBlogs } from "@/lib/queries";
import Image from "next/image";
import Link from "next/link";

function Skeleton() {
  return (
    <div className="grid gap-8 sm:gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900/50">
          <div className="w-full h-56 bg-zinc-800 shimmer" />
          <div className="p-6 space-y-3">
            <div className="h-5 bg-zinc-800 rounded shimmer w-3/4" />
            <div className="h-4 bg-zinc-800 rounded shimmer w-full" />
            <div className="h-4 bg-zinc-800 rounded shimmer w-1/2" />
            <div className="h-3 bg-zinc-800 rounded shimmer w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function BlogsPage() {
  const { data: blogPosts, isLoading, error } = useBlogs();

  return (
    <section className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 reveal">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-emerald-400 mb-3">
            Our Blog
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Latest Articles
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
            Thoughts, tutorials, and insights on web development, design, and technology.
          </p>
        </div>

        {/* Loading */}
        {isLoading && <Skeleton />}

        {/* Error */}
        {error && !isLoading && (
          <div className="text-center py-20">
            <p className="text-red-400 text-lg">Failed to load blog posts.</p>
            <p className="text-zinc-500 text-sm mt-2">Please try again later.</p>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !error && blogPosts?.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-zinc-800 flex items-center justify-center">
              <svg className="w-8 h-8 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No articles yet</h3>
            <p className="text-zinc-500">Check back soon for new content.</p>
          </div>
        )}

        {/* Blog Grid */}
        {!isLoading && blogPosts && blogPosts.length > 0 && (
          <div className="grid gap-8 sm:gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post, i) => (
              <Link
                key={post.id}
                href="#"
                className="group block rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900/50 card-h transition-all duration-300 reveal"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {/* Image */}
                <div className="relative w-full h-56 overflow-hidden">
                  <Image
                    src={post.image || "/assets/default-blog-image.jpg"}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors duration-200 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3 mb-4">
                    {post.message}
                  </p>
                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {post.author}
                    </span>
                    <span>
                      {post.created_at
                        ? new Date(post.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : ""}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
