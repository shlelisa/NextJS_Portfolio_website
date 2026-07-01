"use client";
import React from "react";
import { useState, useEffect } from "react";
import { supabase } from "@/app/supabase/supabaseClient";

const cards = [
  { key: "blogs", label: "Blogs Posted", icon: "📝" },
  { key: "contact", label: "Contact Messages", icon: "📬" },
  { key: "skills", label: "Skills Updated", icon: "🛠️" },
  { key: "projects", label: "Projects Added", icon: "📁" },
] as const;

const AdminDashboard = () => {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchCounts = async () => {
      const tables = ["blogs", "contact", "skills", "projects"];
      const results: Record<string, number> = {};
      for (const table of tables) {
        const { data } = await supabase.from(table).select("*");
        results[table] = data?.length ?? 0;
      }
      setCounts(results);
    };
    fetchCounts();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card) => (
        <div
          key={card.key}
          className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center hover:border-zinc-700 transition-colors"
        >
          <h3 className="text-sm font-medium text-zinc-400 mb-3">{card.icon} {card.label}</h3>
          <p className="text-3xl font-bold text-emerald-400">{counts[card.key] ?? "—"}</p>
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;
