"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/app/supabase/supabaseClient";
import { v4 as uuidv4 } from "uuid";

interface ProjectType {
  id: string; title: string; description: string; technology: string;
  features: string; image_urls: string[]; live_demo_url: string[];
}

const thCls = "px-4 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider border-b border-zinc-800 bg-zinc-900/50";
const tdCls = "px-4 py-3 text-sm text-zinc-300 border-b border-zinc-800/50 align-top";

const Project = () => {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", technology: "", features: "", image_urls: [] as string[], live_demo_url: [] as string[] });
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchProjects = async () => {
    const { data } = await supabase.from("projects").select("*");
    if (data) setProjects(data);
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    const imageUrls: string[] = [];
    if (imageFiles) {
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const fileExt = file.name.split(".").pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `projects/${fileName}`;
        const { error: uploadError } = await supabase.storage.from("photo").upload(filePath, file);
        if (uploadError) { alert("Failed to upload image."); setUploading(false); return; }
        const { data: publicUrl } = supabase.storage.from("photo").getPublicUrl(filePath);
        imageUrls.push(publicUrl.publicUrl);
      }
    }

    const payload = { ...formData, image_urls: imageUrls.length ? imageUrls : formData.image_urls };
    const response = editingId
      ? await supabase.from("projects").update(payload).eq("id", editingId)
      : await supabase.from("projects").insert([payload]);

    if (response.error) alert("Error saving project: " + response.error.message);
    else {
      alert(editingId ? "Project updated!" : "Project added!");
      fetchProjects();
      setFormData({ title: "", description: "", technology: "", features: "", image_urls: [], live_demo_url: [] });
      setImageFiles(null); setModalOpen(false); setEditingId(null);
    }
    setUploading(false);
  };

  const handleEdit = (project: ProjectType) => {
    setFormData(project); setModalOpen(true); setEditingId(project.id);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (!error) fetchProjects();
    }
  };

  const inputCls = "w-full px-4 py-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50";

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-zinc-100">Project Management</h2>
        <button
          onClick={() => { setFormData({ title: "", description: "", technology: "", features: "", image_urls: [], live_demo_url: [] }); setModalOpen(true); setEditingId(null); }}
          className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors"
        >
          + Add New Project
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full border-collapse bg-zinc-900/30">
          <thead>
            <tr>
              <th className={thCls}>Id</th>
              <th className={thCls}>Title</th>
              <th className={thCls}>Technology</th>
              <th className={thCls}>Features</th>
              <th className={thCls}>Live Demo</th>
              <th className={thCls}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-zinc-800/30 transition-colors">
                <td className={tdCls}>{project.id}</td>
                <td className={tdCls + " font-medium text-zinc-100"}>{project.title}</td>
                <td className={tdCls}>{project.technology}</td>
                <td className={tdCls}>{project.features}</td>
                <td className={tdCls}>
                  {project.live_demo_url.length > 0 ? (
                    <a href={project.live_demo_url[0]} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 underline">View Live Demo</a>
                  ) : "—"}
                </td>
                <td className={tdCls}>
                  <button onClick={() => handleEdit(project)} className="px-3 py-1.5 rounded-md bg-zinc-700 hover:bg-zinc-600 text-zinc-200 text-xs font-medium transition-colors mr-2">Edit</button>
                  <button onClick={() => handleDelete(project.id)} className="px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-500 text-white text-xs font-medium transition-colors">Delete</button>
                </td>
              </tr>
            ))}
            {projects.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-zinc-500">No projects added yet.</td></tr>}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <form onSubmit={handleSubmit} className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-h-[90vh] overflow-y-auto space-y-4">
            <h2 className="text-lg font-bold text-zinc-100 text-center">{editingId ? "Edit Project" : "Add Project"}</h2>

            <label className="text-sm text-zinc-400">Project Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className={inputCls} />

            <label className="text-sm text-zinc-400">Technology</label>
            <textarea name="technology" value={formData.technology} onChange={handleInputChange} required className={inputCls + " resize-y"} rows={2} />

            <label className="text-sm text-zinc-400">Features</label>
            <textarea name="features" value={formData.features} onChange={handleInputChange} required className={inputCls + " resize-y"} rows={2} />

            <label className="text-sm text-zinc-400">Description</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} required className={inputCls + " resize-y"} rows={3} />

            <label className="text-sm text-zinc-400">Live Demo URL</label>
            <input type="text" name="live_demo_url" value={formData.live_demo_url} onChange={handleInputChange} className={inputCls} />

            <div>
              <label className="text-sm text-zinc-400 block mb-1">Images</label>
              <input type="file" accept="image/*" multiple onChange={(e) => setImageFiles(e.target.files)} className="text-sm text-zinc-400 file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-zinc-700 file:text-zinc-200 hover:file:bg-zinc-600" />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={uploading} className="flex-1 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-medium text-sm transition-colors">
                {uploading ? "Saving..." : "Save"}
              </button>
              <button type="button" onClick={() => setModalOpen(false)} className="px-6 py-2.5 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-zinc-200 font-medium text-sm transition-colors">Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Project;
