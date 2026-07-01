"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/supabase/supabaseClient";

import AddBlog from "./blogs/AddBlog";
import AdminDashboard from "./dashboard/AdminDashboard";
import Contact from "./contact/Contact";
import Skill from "./skills/skill";
import Project from "./project/project";
import Profile from "./profiles/profile";

const tabs = [
  { key: "dashboard", label: "Dashboard" },
  { key: "addBlog", label: "Post Blog" },
  { key: "contact", label: "Contact Messages" },
  { key: "skills", label: "Update Skills" },
  { key: "projects", label: "Add Projects" },
  { key: "profiles", label: "Profiles" },
] as const;

const AdminPanel = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/admin/login");
      } else {
        setLoading(false);
      }
    };
    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) router.push("/admin/login");
    });

    return () => authListener?.subscription.unsubscribe();
  }, [router]);

  useEffect(() => {
    const close = () => setShowDropdown(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <p className="text-zinc-400 text-lg">Checking session...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-950 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col shrink-0">
        <div className="px-6 py-6 border-b border-zinc-800">
          <h2 className="text-xl font-bold text-emerald-400 tracking-tight">
            Admin Panel
          </h2>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              data-active={activeTab === tab.key}
              className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors
                data-[active=true]:bg-emerald-500/10 data-[active=true]:text-emerald-400 data-[active=true]:border-l-2 data-[active=true]:border-l-emerald-500
                data-[active=false]:text-zinc-400 data-[active=false]:hover:text-zinc-200 data-[active=false]:hover:bg-zinc-800/50"
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="bg-zinc-900/80 backdrop-blur-sm border-b border-zinc-800 px-6 py-3 flex justify-end items-center">
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setShowDropdown(!showDropdown); }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 text-sm font-medium hover:bg-zinc-700 transition-colors"
            >
              Admin ▾
            </button>
            {showDropdown && (
              <div
                className="absolute right-0 top-full mt-1 w-40 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl py-1 z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {activeTab === "dashboard" && <AdminDashboard />}
          {activeTab === "addBlog" && <AddBlog />}
          {activeTab === "contact" && <Contact />}
          {activeTab === "skills" && <Skill />}
          {activeTab === "projects" && <Project />}
          {activeTab === "profiles" && <Profile />}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
