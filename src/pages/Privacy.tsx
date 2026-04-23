import { motion } from "motion/react";
import { Lock, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto py-24 px-6">
      <Link to="/" className="inline-flex items-center gap-2 text-brand-navy/40 hover:text-brand-navy text-[10px] uppercase tracking-widest font-bold transition-colors mb-12">
        <ChevronLeft size={14} /> Back to Home
      </Link>
      
      <div className="mb-12 lg:mb-16">
        <Lock size={48} className="text-brand-gold mb-6" />
        <h1 className="text-3xl sm:text-5xl font-serif text-brand-navy mb-4">Privacy Policy</h1>
        <p className="text-brand-navy/40 text-[10px] uppercase tracking-[0.3em] font-bold">Last Updated: April 2026</p>
      </div>

      <div className="prose prose-brand max-w-none space-y-12 text-brand-navy/70 leading-relaxed">
        <section>
          <h2 className="text-2xl font-serif text-brand-navy mb-6">1. Information We Collect</h2>
          <p>
            We collect personal information that you provide directly to us, including your name, email address, phone number, and service address. We also collect technical data about your AC equipment to provide more accurate service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-brand-navy mb-6">2. How We Use Your Data</h2>
          <p>
            Your data is used exclusively to provide, maintain, and improve our services. This includes scheduling technicians, generating invoices, and sending relevant service updates. We do not sell your personal data to third parties.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-brand-navy mb-6">3. Data Security</h2>
          <p>
            We implement industry-standard security measures, including 256-bit SSL encryption, to protect your data. Access to your personal information is strictly limited to authorized personnel who require it to perform their duties.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-brand-navy mb-6">4. Your Rights</h2>
          <p>
            You have the right to access, correct, or delete your personal information at any time through your profile settings. You can also manage your communication preferences to control exactly how we contact you.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-brand-navy mb-6">5. Cookies</h2>
          <p>
            We use cookies to enhance your experience on our website, remember your preferences, and analyze our traffic. You can control cookie settings through your browser, though some features may be limited.
          </p>
        </section>
      </div>

      <div className="mt-16 lg:mt-24 p-8 sm:p-12 bg-brand-navy/5 rounded-sm border border-brand-navy/5 text-center">
        <h3 className="text-2xl font-serif text-brand-navy mb-6">Data Protection Officer</h3>
        <p className="text-brand-navy/40 text-sm mb-10 max-w-md mx-auto">
          For any privacy-related inquiries, please contact our Data Protection Officer at privacy@coolzo.com.
        </p>
      </div>
    </div>
  );
}
