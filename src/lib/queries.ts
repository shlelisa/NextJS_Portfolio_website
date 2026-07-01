import { useQuery } from "@tanstack/react-query";
import { supabase } from "./supabase";

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("firstName, profileTitle")
        .single();
      if (error) throw error;
      return data as { firstName: string; profileTitle: string };
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useSkills() {
  return useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("skills")
        .select("name");
      if (error) throw error;
      return (data as { name: string }[]).map((s) => s.name);
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Project[];
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useExperiences() {
  return useQuery({
    queryKey: ["experiences"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .order("start_date", { ascending: false });
      if (error) throw error;
      return data as Experience[];
    },
    staleTime: 1000 * 60 * 5,
  });
}

export type Project = {
  id: string;
  title: string;
  description: string;
  technology: string;
  image_urls?: string[];
  live_url?: string;
  github_url?: string;
  created_at?: string;
};

export function useBlogs() {
  return useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Blog[];
    },
    staleTime: 1000 * 60 * 5,
  });
}

export type Blog = {
  id: number;
  title: string;
  message: string;
  author: string;
  image: string;
  created_at: string;
};

export type Experience = {
  id: string;
  company: string;
  role: string;
  start_date: string;
  end_date?: string;
  description?: string;
  tech_stack?: string;
};
