import { useState } from "react";
import { motion } from "motion/react";
import { 
  Gift, 
  Copy, 
  MessageSquare, 
  Share2, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Users,
  Award
} from "lucide-react";

export default function Referral() {
  const [copied, setCopied] = useState(false);
  const referralCode = "COOLZO-FAYAZ-2026";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const referrals = [
    { name: "Ahmed Khan", status: "Booked", reward: "₹500 Earned", date: "Apr 05, 2026" },
    { name: "Priya Sharma", status: "Invited", reward: "Pending", date: "Apr 08, 2026" },
    { name: "Rahul Verma", status: "Reward Earned", reward: "₹500 Earned", date: "Mar 15, 2026" },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-serif text-brand-navy mb-2">Refer & Earn</h1>
        <p className="text-brand-navy/40 text-[10px] uppercase tracking-[0.3em] font-bold">Grow the elite circle</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Main Referral Card */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-brand-navy p-12 rounded-sm text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-gold/5 skew-x-12 translate-x-1/4" />
            <div className="relative z-10">
              <Gift size={48} className="text-brand-gold mb-8" />
              <h2 className="text-4xl font-serif mb-6">Give ₹500, Get ₹500.</h2>
              <p className="text-white/50 text-lg mb-12 leading-relaxed font-light max-w-xl">
                Invite your friends to experience Coolzo Premium AC Services. They get ₹500 off their first booking, and you get ₹500 in credits when they complete their service.
              </p>

              <div className="bg-white/5 border border-white/10 p-8 rounded-sm flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-2">Your Personal Code</p>
                  <p className="text-2xl font-serif tracking-widest text-brand-gold">{referralCode}</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                  <button 
                    onClick={handleCopy}
                    className="flex-grow md:flex-none bg-white text-brand-navy px-8 py-4 rounded-sm text-[10px] uppercase tracking-widest font-bold hover:bg-brand-gold transition-all flex items-center justify-center gap-3"
                  >
                    {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                    {copied ? "Copied" : "Copy Code"}
                  </button>
                  <button className="p-4 bg-green-600 text-white rounded-sm hover:bg-green-700 transition-all">
                    <MessageSquare size={20} />
                  </button>
                  <button className="p-4 bg-white/10 text-white rounded-sm hover:bg-white/20 transition-all">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* How it works */}
          <div className="bg-white p-10 rounded-sm border border-brand-navy/5 shadow-sm">
            <h3 className="text-xl font-serif text-brand-navy mb-10">How it works</h3>
            <div className="grid md:grid-cols-3 gap-12">
              {[
                { step: "01", title: "Share Code", desc: "Send your unique referral code to your friends and family." },
                { step: "02", title: "They Book", desc: "They get ₹500 off their first premium service using your code." },
                { step: "03", title: "You Earn", desc: "You receive ₹500 in Coolzo credits once their service is done." },
              ].map((item, i) => (
                <div key={i} className="relative">
                  <span className="text-6xl font-serif text-brand-navy/5 absolute -top-4 -left-2">{item.step}</span>
                  <div className="relative z-10">
                    <h4 className="text-sm font-bold text-brand-navy mb-3">{item.title}</h4>
                    <p className="text-xs text-brand-navy/40 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Referral List */}
          <div className="bg-white p-10 rounded-sm border border-brand-navy/5 shadow-sm">
            <h3 className="text-xl font-serif text-brand-navy mb-8">My Referrals</h3>
            <div className="space-y-4">
              {referrals.map((ref, i) => (
                <div key={i} className="flex items-center justify-between p-6 rounded-sm border border-brand-navy/5 hover:bg-brand-navy/5 transition-colors">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-full bg-brand-navy/5 flex items-center justify-center text-brand-navy/40">
                      <Users size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-brand-navy">{ref.name}</p>
                      <p className="text-[9px] uppercase tracking-widest text-brand-navy/40">{ref.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[8px] uppercase tracking-widest font-bold px-3 py-1 rounded-full mb-1 inline-block ${
                      ref.status === 'Invited' ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'
                    }`}>
                      {ref.status}
                    </span>
                    <p className="text-[10px] font-bold text-brand-navy">{ref.reward}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-sm border border-brand-navy/5 shadow-sm">
            <TrendingUp className="text-brand-gold mb-6" size={24} />
            <p className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40 mb-1">Total Credits Earned</p>
            <h3 className="text-4xl font-serif text-brand-navy mb-8">₹1,500</h3>
            
            <div className="space-y-4 pt-8 border-t border-brand-navy/5">
              <div className="flex justify-between text-xs">
                <span className="text-brand-navy/40">Successful Referrals</span>
                <span className="text-brand-navy font-bold">3</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-brand-navy/40">Pending Invites</span>
                <span className="text-brand-navy font-bold">1</span>
              </div>
            </div>

            <button className="w-full mt-8 bg-brand-navy text-white py-4 rounded-sm text-[10px] uppercase tracking-widest font-bold hover:bg-brand-gold transition-all">
              Redeem Credits
            </button>
          </div>

          <div className="bg-brand-gold/10 p-8 rounded-sm border border-brand-gold/20">
            <Award className="text-brand-gold mb-4" size={24} />
            <h4 className="text-sm font-bold text-brand-navy mb-2">Elite Ambassador</h4>
            <p className="text-xs text-brand-navy/60 leading-relaxed mb-6">
              Refer 5 more friends to unlock the "Elite Ambassador" badge and get a free Luxury Jet Wash for your entire home.
            </p>
            <div className="h-2 bg-white rounded-full overflow-hidden mb-2">
              <div className="h-full bg-brand-gold w-[60%]" />
            </div>
            <p className="text-[8px] uppercase tracking-widest font-bold text-brand-navy/40 text-right">3/5 Referrals</p>
          </div>
        </div>
      </div>
    </div>
  );
}
