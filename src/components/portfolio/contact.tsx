"use client";

import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import emailjs from "emailjs-com";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

export default function Contact() {
  const form = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<{
    type: "success" | "error" | "";
    message: string;
  }>({ type: "", message: "" });
  const [sending, setSending] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );
    if (sectionRef.current) {
      sectionRef.current
        .querySelectorAll(".reveal")
        .forEach((el) => io.observe(el));
    }
    return () => io.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.current) return;
    setSending(true);
    setStatus({ type: "", message: "" });

    const formData = {
      name: (form.current.elements.namedItem("name") as HTMLInputElement)
        ?.value,
      email: (form.current.elements.namedItem("email") as HTMLInputElement)
        ?.value,
      title: (form.current.elements.namedItem("subject") as HTMLInputElement)
        ?.value,
      message: (
        form.current.elements.namedItem("message") as HTMLTextAreaElement
      )?.value,
    };

    try {
      await emailjs.sendForm(
        "service_g13uyno",
        "template_o67n72i",
        form.current,
        "vC6pt6HJ8sIAh3fQ3",
      );
      await supabase.from("contact").insert([formData]);
      setStatus({ type: "success", message: "Message sent successfully!" });
      form.current.reset();
    } catch {
      setStatus({ type: "error", message: "Failed to send message." });
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" ref={sectionRef} className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="bg-foreground dark:bg-zinc-800 rounded-3xl p-10 md:p-16 relative overflow-hidden">
          <div
            className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute bottom-0 left-0 w-40 h-40 bg-primary/10 rounded-full blur-2xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-start">
            <div>
              <p className="reveal text-xs font-medium text-primary tracking-widest uppercase mb-3">
                Get in touch
              </p>
              <h2 className="reveal d1 font-display font-bold text-4xl md:text-5xl text-white leading-tight mb-5">
                Let&apos;s work
                <br />
                together
              </h2>
              <p className="reveal d2 text-zinc-400 leading-relaxed mb-8">
                I&apos;m open to development and design opportunities. Whether
                you need a full application, a landing page, or just a second
                pair of eyes — let&apos;s talk.
              </p>

              <div className="reveal d3 flex flex-col gap-4">
                <ContactLink
                  href="mailto:lelisashashura@gmail.com"
                  icon={<FaEnvelope className="w-4 h-4" />}
                  label="lelisashashura@gmail.com"
                />
                <ContactLink
                  href="https://www.linkedin.com/in/lelisa-shashura-4935a2259/"
                  icon={<FaLinkedin className="w-4 h-4" />}
                  label="linkedin.com/in/lelisa"
                />
                <ContactLink
                  href="https://github.com/shlelisa"
                  icon={<FaGithub className="w-4 h-4" />}
                  label="github.com/shlelisa"
                />
              </div>
            </div>

            <div className="reveal d2">
              <form ref={form} onSubmit={handleSubmit} noValidate>
                <div className="flex flex-col gap-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-xs font-medium text-zinc-400 mb-1.5"
                      >
                        Name <span aria-hidden="true">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Jane Smith"
                        required
                        autoComplete="name"
                        className="w-full bg-zinc-800 border border-zinc-700 text-white text-sm rounded-xl px-4 py-3 placeholder-zinc-600 focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-xs font-medium text-zinc-400 mb-1.5"
                      >
                        Email <span aria-hidden="true">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="jane@company.com"
                        required
                        autoComplete="email"
                        className="w-full bg-zinc-800 border border-zinc-700 text-white text-sm rounded-xl px-4 py-3 placeholder-zinc-600 focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-xs font-medium text-zinc-400 mb-1.5"
                    >
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      placeholder="Project inquiry"
                      className="w-full bg-zinc-800 border border-zinc-700 text-white text-sm rounded-xl px-4 py-3 placeholder-zinc-600 focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-xs font-medium text-zinc-400 mb-1.5"
                    >
                      Message <span aria-hidden="true">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      placeholder="Tell me about your project..."
                      required
                      className="w-full bg-zinc-800 border border-zinc-700 text-white text-sm rounded-xl px-4 py-3 placeholder-zinc-600 focus:outline-none focus:border-primary transition-colors resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sending}
                    className="shimmer w-full bg-primary text-primary-foreground font-display font-bold text-sm py-3.5 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {sending ? "Sending..." : "Send message →"}
                  </button>

                  {status.message && (
                    <p
                      className={`text-sm font-medium ${
                        status.type === "success"
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      {status.message}
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="group flex items-center gap-3 text-zinc-400 hover:text-white transition-colors"
    >
      <span className="w-9 h-9 flex items-center justify-center bg-zinc-800 rounded-lg group-hover:bg-primary/20 transition-colors shrink-0">
        {icon}
      </span>
      <span className="text-sm">{label}</span>
    </a>
  );
}
