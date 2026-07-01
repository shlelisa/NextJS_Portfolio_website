"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/app/supabase/supabaseClient";

type SkillType = { id: number; name: string };

const Skill = () => {
  const [skills, setSkills] = useState<SkillType[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => { fetchSkills(); }, []);

  const fetchSkills = async () => {
    const { data } = await supabase.from("skills").select("*").order("id");
    if (data) setSkills(data);
  };

  const handleAddSkill = async () => {
    if (!newSkill.trim()) return;
    const { error } = await supabase.from("skills").insert({ name: newSkill });
    if (!error) { setNewSkill(""); fetchSkills(); }
  };

  const handleUpdateSkill = async (id: number) => {
    if (!editValue.trim()) return;
    const { error } = await supabase.from("skills").update({ name: editValue }).eq("id", id);
    if (!error) { setEditId(null); setEditValue(""); fetchSkills(); }
  };

  const handleDeleteSkill = async (id: number) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;
    const { error } = await supabase.from("skills").delete().eq("id", id);
    if (!error) fetchSkills();
  };

  const inputCls = "px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50";

  return (
    <div className="max-w-xl">
      <h2 className="text-xl font-bold text-zinc-100 mb-6">Manage Skills</h2>

      <div className="flex items-center gap-3 mb-6">
        <input type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="Enter new skill" className={inputCls + " flex-1"} />
        <button onClick={handleAddSkill} className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors">Add Skill</button>
      </div>

      <div className="space-y-2">
        {skills.map((skill) => (
          <div key={skill.id} className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 flex items-center justify-between gap-3">
            {editId === skill.id ? (
              <>
                <input type="text" value={editValue} onChange={(e) => setEditValue(e.target.value)} className={inputCls + " flex-1"} autoFocus />
                <button onClick={() => handleUpdateSkill(skill.id)} className="px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors">Save</button>
                <button onClick={() => setEditId(null)} className="px-3 py-1.5 rounded-md bg-zinc-700 hover:bg-zinc-600 text-zinc-200 text-xs font-medium transition-colors">Cancel</button>
              </>
            ) : (
              <>
                <span className="text-sm text-zinc-300">{skill.name}</span>
                <div className="flex gap-2">
                  <button onClick={() => { setEditId(skill.id); setEditValue(skill.name); }} className="px-3 py-1.5 rounded-md bg-zinc-700 hover:bg-zinc-600 text-zinc-200 text-xs font-medium transition-colors">Edit</button>
                  <button onClick={() => handleDeleteSkill(skill.id)} className="px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-500 text-white text-xs font-medium transition-colors">Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
        {skills.length === 0 && <p className="text-sm text-zinc-500 text-center py-8">No skills added yet.</p>}
      </div>
    </div>
  );
};

export default Skill;
