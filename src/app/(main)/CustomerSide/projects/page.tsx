// app/projects/page.tsx
"use client";
import { supabase } from "@/app/supabase/supabaseClient";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

interface ProjectType {
  id: string;
  title: string;
  description: string;
  fullDescription?: string;
  technology: string;
  role?: string;
  features: string;
  image_urls?: string[];
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectType[]>([]);

  const fetchProjects = async () => {
    const { data, error } = await supabase.from("projects").select("*");

    if (error) {
      console.error("Error fetching projects:", error);
      return;
    } else {
      setProjects(data || []);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <section className="max-w-7xl mx-auto py-20 px-6">
      <h2 className="text-5xl font-extrabold mb-12 text-center text-blue-800 tracking-wide">
        My Projects
      </h2>

      <div className="grid gap-6 sm:gap-8 lg:gap-10 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/CustomerSide/projects/${project.id}`}
            className="block hover-lift" // Added hover-lift class
          >
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg p-4 sm:p-6 border border-gray-100 hover:border-blue-200 transition-all duration-300 h-full flex flex-col">
              {/* Image with loading state */}
              <div className="relative w-full aspect-[4/3] mb-4 sm:mb-6 overflow-hidden rounded-xl">
                <Image
                  src={
                    project.image_urls?.[0] ||
                    "/assets/default-project-image.jpg"
                  }
                  alt={`Project: ${project.title}`}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  sizes="(max-width: 640px) calc(100vw - 2rem), (max-width: 768px) calc(50vw - 2rem), (max-width: 1024px) calc(33vw - 2rem), 380px"
                  quality={85}
                  priority={false}
                />
              </div>

              {/* Content */}
              <div className="flex flex-col flex-grow">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
                  {project.title}
                </h3>

                <p className="text-gray-600 text-sm sm:text-base mb-4 flex-grow line-clamp-3 leading-relaxed">
                  {project.description}
                </p>

                <div className="text-blue-600 font-semibold text-sm sm:text-base flex items-center group">
                  View Project
                  <span className="ml-2 group-hover:translate-x-2 transition-transform duration-200">
                    →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
