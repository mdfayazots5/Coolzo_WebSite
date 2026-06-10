import { motion } from "motion/react";
import { Phone, Mail, MapPin, MessageCircle, Clock, ShieldCheck, Loader2 } from "lucide-react";
import React, { useState } from "react";
import Container from "../components/Container";
import { useContent } from "../contexts/ContentContext";
import { ContactService } from "../services/contactService";

const SUBJECTS = ["General Inquiry", "Emergency Repair", "AMC Enrollment", "Installation Consultation"];

export default function Contact() {
  const { getBlock } = useContent();
  const block = (key: string, fallback: string) => getBlock(key)?.content?.trim() || fallback;
  const phone = block("contact.phone", "7075949956");
  const whatsapp = block("contact.whatsapp", "7075949956");
  const email = block("contact.email", "mdfayazots5@gmail.com");
  const telDigits = phone.replace(/\D/g, "");
  const waDigits = (() => { const d = whatsapp.replace(/\D/g, ""); return d.length === 10 ? `91${d}` : d; })();

  const [form, setForm] = useState({ name: "", mobile: "", email: "", subject: SUBJECTS[0], message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const mobileValid = /^[2-9]\d{9}$/.test(form.mobile.replace(/\D/g, ""));
  const canSubmit = form.name.trim().length >= 2 && mobileValid && status !== "submitting";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("submitting");
    setErrorMsg("");
    try {
      await ContactService.submitLead({
        customerName: form.name.trim(),
        mobileNumber: form.mobile.replace(/\D/g, ""),
        emailAddress: form.email.trim() || undefined,
        sourceChannel: "web",
        inquiryNotes: `[${form.subject}] ${form.message}`.trim(),
      });
      setStatus("done");
    } catch (err) {
      const e2 = err as { message?: string } | undefined;
      setErrorMsg(e2?.message || "Couldn't send your inquiry. Please call or WhatsApp us instead.");
      setStatus("error");
    }
  };

  const inputClass =
    "w-full bg-white/5 border border-white/10 rounded-lg px-5 py-3.5 text-white text-sm focus:outline-none focus:border-brand-gold focus-visible:ring-2 focus-visible:ring-brand-gold/60 transition-colors";
  const labelClass = "text-[10px] uppercase tracking-widest font-bold text-white/40";

  return (
    <div className="pt-28 pb-20 bg-brand-cream min-h-screen">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-brand-gold-deep text-[10px] uppercase tracking-[0.4em] font-bold mb-3 block">Get in touch</span>
          <h1 className="font-serif text-brand-navy mb-4">We're here to help</h1>
          <p className="text-brand-navy/50 text-base md:text-lg font-light leading-relaxed">
            Emergency repair, a quote, or a question — reach us by phone, WhatsApp, or the form. We respond fast.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Contact info */}
          <div>
            <div className="grid sm:grid-cols-2 gap-5 mb-10">
              <a href={`tel:+91${telDigits}`} className="bg-white p-6 rounded-xl border border-brand-navy/5 hover:border-brand-gold/30 transition-all group">
                <Phone className="text-brand-gold mb-4 group-hover:scale-110 transition-transform" size={22} />
                <p className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40 mb-1">Call us</p>
                <p className="text-base font-serif text-brand-navy">+91 {phone}</p>
              </a>
              <a href={`https://wa.me/${waDigits}`} target="_blank" rel="noopener noreferrer" className="bg-white p-6 rounded-xl border border-brand-navy/5 hover:border-brand-gold/30 transition-all group">
                <MessageCircle className="text-brand-gold mb-4 group-hover:scale-110 transition-transform" size={22} />
                <p className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40 mb-1">WhatsApp</p>
                <p className="text-base font-serif text-brand-navy">Chat with us</p>
              </a>
              <a href={`mailto:${email}`} className="bg-white p-6 rounded-xl border border-brand-navy/5 hover:border-brand-gold/30 transition-all group">
                <Mail className="text-brand-gold mb-4 group-hover:scale-110 transition-transform" size={22} />
                <p className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40 mb-1">Email</p>
                <p className="text-sm font-serif text-brand-navy break-all">{email}</p>
              </a>
              <div className="bg-white p-6 rounded-xl border border-brand-navy/5">
                <Clock className="text-brand-gold mb-4" size={22} />
                <p className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40 mb-1">Hours</p>
                <p className="text-base font-serif text-brand-navy">08:00 — 22:00</p>
              </div>
            </div>

            <div className="border-t border-brand-navy/5 pt-8">
              <h2 className="text-xl font-serif text-brand-navy mb-5">Serving across Hyderabad</h2>
              <div className="grid grid-cols-2 gap-3">
                {["Banjara Hills", "Jubilee Hills", "Gachibowli", "Hitech City", "Madhapur", "Kondapur"].map((c) => (
                  <div key={c} className="flex items-center gap-2.5 text-brand-navy/50 text-sm">
                    <MapPin size={14} className="text-brand-gold shrink-0" /> {c}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-brand-navy p-8 md:p-12 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full bg-brand-gold/5 skew-x-12 translate-x-1/2" />
            <div className="relative z-10">
              {status === "done" ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16">
                  <div className="w-20 h-20 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-7">
                    <ShieldCheck size={38} className="text-brand-gold" />
                  </div>
                  <h2 className="text-2xl font-serif text-white mb-3">Inquiry received</h2>
                  <p className="text-white/50 text-sm leading-relaxed mb-9 max-w-sm mx-auto">
                    Thanks, {form.name.split(" ")[0] || "there"} — our team will reach out shortly. For urgent help, call or WhatsApp us.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setStatus("idle"); setForm({ name: "", mobile: "", email: "", subject: SUBJECTS[0], message: "" }); }}
                    className="text-brand-gold text-[10px] uppercase tracking-widest font-bold hover:text-white transition-colors min-h-[44px]"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <>
                  <h2 className="text-2xl font-serif text-white mb-8">Send an inquiry</h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label htmlFor="c-name" className={labelClass}>Full Name *</label>
                        <input id="c-name" required type="text" value={form.name} onChange={(e) => set("name", e.target.value)} className={inputClass} />
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="c-phone" className={labelClass}>Phone *</label>
                        <input id="c-phone" required type="tel" inputMode="numeric" maxLength={10} value={form.mobile}
                          onChange={(e) => set("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))} className={inputClass} />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="c-email" className={labelClass}>Email</label>
                      <input id="c-email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputClass} />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="c-subject" className={labelClass}>Subject</label>
                      <select id="c-subject" value={form.subject} onChange={(e) => set("subject", e.target.value)} className={`${inputClass} appearance-none`}>
                        {SUBJECTS.map((s) => <option key={s} className="bg-brand-navy">{s}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="c-message" className={labelClass}>Message</label>
                      <textarea id="c-message" rows={4} value={form.message} onChange={(e) => set("message", e.target.value)} className={`${inputClass} resize-none`} />
                    </div>
                    {status === "error" && <p className="text-sm text-red-300">{errorMsg}</p>}
                    <button type="submit" disabled={!canSubmit}
                      className="w-full bg-brand-gold text-brand-navy py-4 rounded-lg text-xs uppercase tracking-widest font-bold hover:bg-white transition-all shadow-xl min-h-[44px] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                      {status === "submitting" ? <><Loader2 size={15} className="animate-spin" /> Sending…</> : "Submit Inquiry"}
                    </button>
                    <p className="text-[11px] text-white/30 text-center">We'll only use your details to respond to this inquiry.</p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
