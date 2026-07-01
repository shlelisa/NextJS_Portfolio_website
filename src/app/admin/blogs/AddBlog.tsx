"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { supabase } from "@/app/supabase/supabaseClient";

type Blog = {
  id: number;
  title: string;
  message: string;
  author: string;
  image: string;
};

const thCls = "px-4 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider border-b border-zinc-800 bg-zinc-900/50";
const tdCls = "px-4 py-3 text-sm text-zinc-300 border-b border-zinc-800/50 align-top";

const AddBlogForm = () => {
  const [formData, setFormData] = useState({ title: "", message: "", author: "", image: "" });
  const [message1, setMessage1] = useState("");
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => { fetchBlogs(); }, []);

  const fetchBlogs = async () => {
    const { data, error } = await supabase.from("blogs").select("*").order("id", { ascending: true });
    if (!error) setBlogs(data as Blog[]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && editingId !== null) {
      const { error } = await supabase.from("blogs").update(formData).eq("id", editingId);
      if (error) setMessage1("Failed to update blog.");
      else { setMessage1("Blog updated successfully!"); resetForm(); }
    } else {
      const { error } = await supabase.from("blogs").insert([formData]);
      if (error) setMessage1("Failed to add blog.");
      else { setMessage1("Blog added successfully!"); resetForm(); }
    }
  };

  const resetForm = () => {
    setFormData({ title: "", message: "", author: "", image: "" });
    setIsEditing(false); setEditingId(null);
    fetchBlogs();
    setTimeout(() => { setMessage1(""); setShowModal(false); }, 1500);
  };

  const handleEdit = (blog: Blog) => {
    setFormData({ title: blog.title, message: blog.message, author: blog.author, image: blog.image });
    setEditingId(blog.id); setIsEditing(true); setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this blog?")) {
      const { error } = await supabase.from("blogs").delete().eq("id", id);
      if (!error) fetchBlogs();
    }
  };

  const filteredBlogs = blogs.filter(
    (b) => b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase())
  );

  const inputCls = "w-full px-4 py-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500";

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-zinc-100">Blog Manager</h2>
        <button
          onClick={() => { setShowModal(true); setIsEditing(false); setFormData({ title: "", message: "", author: "", image: "" }); }}
          className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors"
        >
          + Add New Blog
        </button>
      </div>

      <input
        type="text" placeholder="Search by title or author..."
        value={search} onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 mb-6"
      />

      <div className="overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full border-collapse bg-zinc-900/30">
          <thead>
            <tr>
              <th className={thCls}>Id</th>
              <th className={thCls}>Image</th>
              <th className={thCls}>Title</th>
              <th className={thCls}>Message</th>
              <th className={thCls}>Author</th>
              <th className={thCls}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBlogs.map((blog) => (
              <tr key={blog.id} className="hover:bg-zinc-800/30 transition-colors">
                <td className={tdCls}>{blog.id}</td>
                <td className={tdCls}>
                  <Image src={blog.image} alt="blog" width={80} height={48} className="object-cover rounded-md" />
                </td>
                <td className={tdCls}>{blog.title}</td>
                <td className={tdCls}>{blog.message.slice(0, 60)}...</td>
                <td className={tdCls}>{blog.author}</td>
                <td className={tdCls}>
                  <button onClick={() => handleEdit(blog)} className="px-3 py-1.5 rounded-md bg-zinc-700 hover:bg-zinc-600 text-zinc-200 text-xs font-medium transition-colors mr-2">Edit</button>
                  <button onClick={() => handleDelete(blog.id)} className="px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-500 text-white text-xs font-medium transition-colors">Delete</button>
                </td>
              </tr>
            ))}
            {filteredBlogs.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-zinc-500">No blogs found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-xl p-6 relative">
            <button onClick={() => setShowModal(false)} className="absolute top-3 right-4 text-zinc-500 hover:text-zinc-300 text-xl leading-none">&times;</button>
            <h3 className="text-lg font-bold text-zinc-100 mb-5 text-center">
              {isEditing ? "Edit Blog" : "Add New Blog"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required className={inputCls} />
              <textarea name="message" placeholder="Message" value={formData.message} onChange={handleChange} required rows={4} className={inputCls + " resize-y"} />
              <input type="text" name="author" placeholder="Author" value={formData.author} onChange={handleChange} required className={inputCls} />
              <input type="text" name="image" placeholder="Image URL" value={formData.image} onChange={handleChange} required className={inputCls} />
              <button type="submit" className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-colors">
                {isEditing ? "Update Blog" : "Submit Blog"}
              </button>
            </form>
            {message1 && <p className="text-center mt-4 text-sm font-medium text-emerald-400">{message1}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddBlogForm;
