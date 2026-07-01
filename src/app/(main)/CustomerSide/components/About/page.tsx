"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/app/supabase/supabaseClient";
import React from "react";

interface ProfileType {
  id: string;
  image_url: string;
  name: string;
  about: string;
}

const highlightWords = [
  "Software Engineering",
  "React",
  "Next.js",
  "Node.js",
  "MongoDB",
  "Junior IT Expert",
  "Oromia Construction Corporation",
  "Employee Hiring System",
  "House Rental System",
];

function highlightText(text: string): React.ReactNode[] {
  let parts: React.ReactNode[] = [text];
  highlightWords.forEach((word) => {
    parts = parts.flatMap((part) => {
      if (typeof part === "string") {
        const regex = new RegExp(`(${word})`, "gi");
        const splitParts = part.split(regex);
        return splitParts.map((p, i) =>
          regex.test(p) ? (
            <span key={word + i} className="text-blue-600 font-semibold">
              {p}
            </span>
          ) : (
            p
          )
        );
      }
      return part;
    });
  });
  return parts;
}

const About = () => {
  const [profile, setProfile] = useState<ProfileType | null>(null);

  const fetchProfile = async () => {
    const { data, error } = await supabase.from("profiles").select("*").single();

    if (error) {
      console.error("Error fetching profile:", error);
      return;
    }
    setProfile(data);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <section id="about" className="bg-gray-50 py-20 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        {/* Left side with text */}
        <section
          id="about-text"
          className="max-w-5xl mx-auto px-6 py-20 bg-gray-50"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-10 text-center text-blue-700">
            About Me
          </h2>

          <div className="space-y-6 text-lg text-gray-700 leading-relaxed text-center max-w-3xl mx-auto px-4">
            {profile?.about
              ?.split(".")
              .filter((sentence) => sentence.trim().length > 0)
              .map((sentence, idx) => (
                <p key={idx} className="text-gray-800">
                  {highlightText(sentence.trim())}.
                </p>
              ))}
          </div>
        </section>

        {/* Right side with image */}
        <div className="flex justify-center">
          {profile && (
            <Image
              src={profile.image_url}
              alt={profile.name || "Profile Image"}
              width={288}
              height={288}
              className="rounded-2xl shadow-lg w-72 h-72 object-cover"
              priority
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default About;
