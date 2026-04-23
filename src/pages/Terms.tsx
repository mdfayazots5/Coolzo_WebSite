import { motion } from "motion/react";
import { ShieldCheck, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto py-24 px-6">
      <Link to="/" className="inline-flex items-center gap-2 text-brand-navy/40 hover:text-brand-navy text-[10px] uppercase tracking-widest font-bold transition-colors mb-12">
        <ChevronLeft size={14} /> Back to Home
      </Link>
      
      <div className="mb-12 lg:mb-16">
        <ShieldCheck size={48} className="text-brand-gold mb-6" />
        <h1 className="text-3xl sm:text-5xl font-serif text-brand-navy mb-4">Terms & Conditions</h1>
        <p className="text-brand-navy/40 text-[10px] uppercase tracking-[0.3em] font-bold">Last Updated: April 2026</p>
      </div>

      <div className="prose prose-brand max-w-none space-y-12 text-brand-navy/70 leading-relaxed">
        <section>
          <h2 className="text-2xl font-serif text-brand-navy mb-6">1. Acceptance of Terms</h2>
          <p>
            By accessing and using the Coolzo website and services, you agree to be bound by these Terms and Conditions. Our services are provided exclusively to individuals who can form legally binding contracts under applicable law.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-brand-navy mb-6">2. Service Guarantee</h2>
          <p>
            Coolzo provides a 30-day workmanship guarantee on all precision repairs. This guarantee covers the specific issue addressed during the service. It does not cover new issues or damage caused by external factors after the service is completed.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-brand-navy mb-6">3. Booking & Cancellations</h2>
          <p>
            Bookings can be rescheduled or cancelled up to 4 hours before the scheduled time slot without any penalty. Cancellations made within 4 hours of the appointment may incur a convenience fee of ₹299.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-brand-navy mb-6">4. Payments & Invoicing</h2>
          <p>
            All payments are due upon completion of the service unless otherwise specified in an AMC contract. Digital invoices are generated immediately and must be settled within 7 days to avoid late payment surcharges.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-brand-navy mb-6">5. Limitation of Liability</h2>
          <p>
            Coolzo is not liable for any indirect, incidental, or consequential damages arising from the use of our services. Our total liability for any claim shall not exceed the amount paid for the specific service in question.
          </p>
        </section>
      </div>

      <div className="mt-16 lg:mt-24 p-8 sm:p-12 bg-brand-navy text-white rounded-sm text-center">
        <h3 className="text-2xl font-serif mb-6">Questions about our terms?</h3>
        <p className="text-white/40 text-sm mb-10 max-w-md mx-auto">
          Our legal team is available to clarify any points regarding our service agreement.
        </p>
        <Link to="/contact" className="inline-flex items-center gap-3 bg-brand-gold text-brand-navy px-10 py-4 rounded-sm text-[10px] uppercase tracking-widest font-bold hover:bg-white transition-all">
          Contact Legal Team
        </Link>
      </div>
    </div>
  );
}
