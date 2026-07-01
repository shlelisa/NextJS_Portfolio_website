"use client";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import { supabase } from "@/app/supabase/supabaseClient";
import { FaEnvelope, FaFacebook, FaGithub, FaLinkedin, FaTelegram, FaYoutube } from "react-icons/fa";

type Profile = {
  id: string; firstName: string; middleName: string; lastName: string;
  profileTitle: string; title?: string; image_url?: string; logo?: string;
  linkedin?: string; github?: string; email?: string; about?: string;
  experience?: string; youtube?: string; telegram?: string; facebook?: string;
};

const inputCls = "w-full px-4 py-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50";
const labelCls = "block text-sm font-medium text-zinc-400 mb-1.5";

const ProfilePage = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState<Profile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !form) return;
    setUploadingPhoto(true);
    try {
      const file = e.target.files[0];
      const fileName = `${form.id}-${Date.now()}.${file.name.split(".").pop()}`;
      const filePath = `profile-photos/${fileName}`;
      const { error } = await supabase.storage.from("photo").upload(filePath, file);
      if (error) throw error;
      const { data: publicUrlData } = supabase.storage.from("photo").getPublicUrl(filePath);
      const newImageUrl = publicUrlData.publicUrl;
      const { error: updateError } = await supabase.from("profiles").update({ image_url: newImageUrl }).eq("id", form.id);
      if (updateError) throw updateError;
      setForm({ ...form, image_url: newImageUrl });
      setProfile({ ...profile!, image_url: newImageUrl });
      setSuccessMessage("Profile photo updated!");
      setTimeout(() => setSuccessMessage(""), 1000);
    } catch (err) {
      console.error("Error uploading photo:", err);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !form) return;
    setUploadingLogo(true);
    try {
      const file = e.target.files[0];
      const fileName = `${form.id}-logo-${Date.now()}.${file.name.split(".").pop()}`;
      const filePath = `logos/${fileName}`;
      const { error } = await supabase.storage.from("photo").upload(filePath, file);
      if (error) throw error;
      const { data: publicUrlData } = supabase.storage.from("photo").getPublicUrl(filePath);
      const newLogoUrl = publicUrlData.publicUrl;
      const { error: updateError } = await supabase.from("profiles").update({ logo: newLogoUrl }).eq("id", form.id);
      if (updateError) throw updateError;
      setForm({ ...form, logo: newLogoUrl });
      setProfile({ ...profile!, logo: newLogoUrl });
      setSuccessMessage("Logo updated!");
      setTimeout(() => setSuccessMessage(""), 1000);
    } catch (err) {
      console.error("Error uploading logo:", err);
    } finally {
      setUploadingLogo(false);
    }
  };

  useEffect(() => {
    const getProfileData = async () => {
      const { data, error } = await supabase.from("profiles").select("*").limit(1).single();
      if (!error && data) { setProfile(data); setForm(data); }
    };
    getProfileData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!form) return;
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!form) return;
    const updateData = {
      firstName: form.firstName, middleName: form.middleName, lastName: form.lastName,
      profileTitle: form.profileTitle, image_url: form.image_url, logo: form.logo,
      linkedin: form.linkedin, github: form.github, email: form.email,
      about: form.about, experience: form.experience,
    };
    const { error } = await supabase.from("profiles").update(updateData).eq("id", form.id);
    if (error) console.error("Update error:", error.message);
    else { setProfile(form); setEditMode(false); setSuccessMessage("Profile saved!"); }
    setTimeout(() => setSuccessMessage(""), 1000);
  };

  if (!profile || !form) {
    return <div className="text-center py-12 text-zinc-500">Loading profile...</div>;
  }

  return (
    <div className="max-w-3xl">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8">
        {/* Header */}
        <div className="flex flex-wrap gap-6 items-start">
          {form.image_url && (
            <div className="text-center">
              <Image src={form.image_url} alt="Profile" width={120} height={120} className="rounded-full border-4 border-emerald-500/30 mx-auto" />
              <label className="mt-2 inline-block px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs cursor-pointer transition-colors">
                {uploadingPhoto ? "Uploading..." : "Edit Photo"}
                <input type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhotoChange} />
              </label>
            </div>
          )}

          {form.logo && (
            <div className="text-center">
              <Image src={form.logo} alt="Logo" width={80} height={80} className="rounded-lg border border-zinc-700 mx-auto" />
              <label className="mt-2 inline-block px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs cursor-pointer transition-colors">
                {uploadingLogo ? "Uploading..." : "Change Logo"}
                <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleLogoChange} />
              </label>
            </div>
          )}

          <div className="flex-1 min-w-[200px]">
            {editMode ? (
              <div className="space-y-3">
                <div>
                  <label className={labelCls}>First Name</label>
                  <input type="text" name="firstName" value={form.firstName} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Middle Name</label>
                  <input type="text" name="middleName" value={form.middleName} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Last Name</label>
                  <input type="text" name="lastName" value={form.lastName} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Title</label>
                  <input type="text" name="profileTitle" value={form.profileTitle} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Image URL</label>
                  <input type="text" name="image_url" value={form.image_url} onChange={handleChange} className={inputCls} />
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-emerald-400">{profile.firstName} {profile.middleName} {profile.lastName}</h1>
                <p className="text-zinc-400 mt-1">{profile.title}</p>
              </>
            )}

            {editMode ? (
              <div className="space-y-3 mt-4">
                <div>
                  <label className={labelCls}>Email</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>LinkedIn</label>
                  <input type="text" name="linkedin" value={form.linkedin} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>GitHub</label>
                  <input type="text" name="github" value={form.github} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Facebook</label>
                  <input type="text" name="facebook" value={form.facebook || ""} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Telegram</label>
                  <input type="text" name="telegram" value={form.telegram || ""} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>YouTube</label>
                  <input type="text" name="youtube" value={form.youtube || ""} onChange={handleChange} className={inputCls} />
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3 mt-4">
                {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noopener noreferrer"><FaLinkedin size={24} className="text-[#0A66C2] hover:scale-110 transition-transform" /></a>}
                {profile.github && <a href={profile.github} target="_blank" rel="noopener noreferrer"><FaGithub size={24} className="text-zinc-400 hover:text-zinc-200 hover:scale-110 transition-all" /></a>}
                {profile.email && <a href={`mailto:${profile.email}`}><FaEnvelope size={24} className="text-[#D44638] hover:scale-110 transition-transform" /></a>}
                {profile.facebook && <a href={profile.facebook} target="_blank" rel="noopener noreferrer"><FaFacebook size={24} className="text-[#1877F2] hover:scale-110 transition-transform" /></a>}
                {profile.telegram && <a href={profile.telegram} target="_blank" rel="noopener noreferrer"><FaTelegram size={24} className="text-[#0088cc] hover:scale-110 transition-transform" /></a>}
                {profile.youtube && <a href={profile.youtube} target="_blank" rel="noopener noreferrer"><FaYoutube size={24} className="text-[#FF0000] hover:scale-110 transition-transform" /></a>}
              </div>
            )}
          </div>
        </div>

        {/* About Me */}
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-zinc-100 border-b border-zinc-800 pb-2 mb-4">About Me</h2>
          {editMode ? (
            <textarea name="about" value={form.about} onChange={handleChange} className={inputCls + " h-28 resize-y"} />
          ) : (
            <div className="text-sm text-zinc-300 leading-relaxed"><ReactMarkdown>{profile.about}</ReactMarkdown></div>
          )}
        </section>

        {/* Experience */}
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-zinc-100 border-b border-zinc-800 pb-2 mb-4">Experience</h2>
          {editMode ? (
            <textarea name="experience" value={form.experience} onChange={handleChange} className={inputCls + " h-28 resize-y"} />
          ) : (
            <div className="text-sm text-zinc-300 leading-relaxed"><ReactMarkdown>{profile.experience}</ReactMarkdown></div>
          )}
        </section>

        {/* Buttons */}
        <div className="mt-8 flex items-center gap-3">
          {editMode ? (
            <>
              <button onClick={handleSave} className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-colors">Save</button>
              <button onClick={() => setEditMode(false)} className="px-5 py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-zinc-200 font-medium text-sm transition-colors">Cancel</button>
            </>
          ) : (
            <>
              <button onClick={() => setEditMode(true)} className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-colors">Edit Profile</button>
              {successMessage && <span className="text-sm font-medium text-emerald-400">{successMessage}</span>}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
