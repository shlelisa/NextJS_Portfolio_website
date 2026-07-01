"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/app/supabase/supabaseClient";
import Papa from "papaparse";

type Contact = {
  id: number; name: string; email: string; title: string; message: string; created_at: string;
};

const thCls = "px-4 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider border-b border-zinc-800 bg-zinc-900/50";
const tdCls = "px-4 py-3 text-sm text-zinc-300 border-b border-zinc-800/50 align-top";

const ContactTable = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [viewedContact, setViewedContact] = useState<Contact | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => { fetchContacts(); }, []);

  const fetchContacts = async () => {
    const { data } = await supabase.from("contact").select("*");
    if (data) setContacts(data);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    await supabase.from("contact").delete().eq("id", id);
    fetchContacts();
  };

  const handleView = (contact: Contact) => {
    setViewedContact(contact);
    setIsModalOpen(true);
  };

  const handleExportCSV = () => {
    const csv = Papa.unparse(contacts);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "contacts.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredContacts = contacts.filter(
    (c) => c.email.toLowerCase().includes(search.toLowerCase()) || c.title.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  const pageContacts = filteredContacts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="max-w-6xl">
      <h2 className="text-xl font-bold text-zinc-100 mb-6">Contact Messages</h2>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <input
          type="text" placeholder="Search by email or title..."
          value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          className="flex-1 min-w-[200px] px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        />
        <button onClick={handleExportCSV} className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors">
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full border-collapse bg-zinc-900/30">
          <thead>
            <tr>
              <th className={thCls}>Id</th>
              <th className={thCls}>Name</th>
              <th className={thCls}>Email</th>
              <th className={thCls}>Title</th>
              <th className={thCls}>Message</th>
              <th className={thCls}>Received At</th>
              <th className={thCls}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageContacts.length > 0 ? pageContacts.map((c) => (
              <tr key={c.id} className="hover:bg-zinc-800/30 transition-colors">
                <td className={tdCls}>{c.id}</td>
                <td className={tdCls}>{c.name}</td>
                <td className={tdCls}>{c.email}</td>
                <td className={tdCls}>{c.title}</td>
                <td className={tdCls}>{c.message.length > 50 ? c.message.substring(0, 50) + "..." : c.message}</td>
                <td className={tdCls}>{new Date(c.created_at).toLocaleString()}</td>
                <td className={tdCls}>
                  <button onClick={() => handleView(c)} className="px-3 py-1.5 rounded-md bg-zinc-700 hover:bg-zinc-600 text-zinc-200 text-xs font-medium transition-colors mr-2">View</button>
                  <button onClick={() => handleDelete(c.id)} className="px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-500 text-white text-xs font-medium transition-colors">Delete</button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-zinc-500">No contact messages found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i} onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${currentPage === i + 1 ? "bg-emerald-600 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {isModalOpen && viewedContact && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h3 className="text-lg font-bold text-zinc-100 mb-4">{viewedContact.title}</h3>
            <div className="space-y-2 text-sm text-zinc-300">
              <p><span className="text-zinc-500">Name:</span> {viewedContact.name}</p>
              <p><span className="text-zinc-500">Email:</span> {viewedContact.email}</p>
              <p><span className="text-zinc-500">Message:</span></p>
              <p className="leading-relaxed">{viewedContact.message}</p>
              <p className="text-xs text-zinc-500">Received on: {new Date(viewedContact.created_at).toLocaleString()}</p>
            </div>
            <button onClick={() => setIsModalOpen(false)} className="mt-6 px-4 py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-zinc-200 text-sm font-medium transition-colors">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactTable;
