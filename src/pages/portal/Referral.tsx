import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Gift,
  Copy,
  MessageSquare,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Users,
  Award,
  Loader2,
  Sparkles,
} from "lucide-react";
import { MarketingService } from "../../services/marketingService";
import type {
  LoyaltyResponse,
  PromotionalOffer,
  ReferralStatsResponse,
} from "../../services/marketingService";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

const AMBASSADOR_GOAL = 5;

export default function Referral() {
  const [stats, setStats] = useState<ReferralStatsResponse | null>(null);
  const [loyalty, setLoyalty] = useState<LoyaltyResponse | null>(null);
  const [offers, setOffers] = useState<PromotionalOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;

    Promise.allSettled([
      MarketingService.getReferralStats(),
      MarketingService.getLoyaltyStats(),
      MarketingService.getOffers(),
    ])
      .then(([statsResult, loyaltyResult, offersResult]) => {
        if (!isMounted) return;

        if (statsResult.status === "fulfilled") {
          setStats(statsResult.value);
        }

        if (loyaltyResult.status === "fulfilled") {
          setLoyalty(loyaltyResult.value);
        }

        if (offersResult.status === "fulfilled") {
          setOffers(offersResult.value);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const referralCode = stats?.referralCode || "—";
  const referralLink = stats?.referralLink || "";

  const handleCopy = () => {
    const textToCopy = referralCode !== "—" ? referralCode : "";
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const text = referralLink
      ? `Use my Coolzo referral link: ${referralLink}`
      : `Use my Coolzo referral code: ${referralCode} and get ₹500 off your first service!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const referrals = stats?.referrals ?? [];
  const successfulReferrals = stats?.successfulReferrals ?? 0;
  const ambassadorProgress = Math.min(successfulReferrals / AMBASSADOR_GOAL, 1);
  const featuredOffers = offers.slice(0, 3);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-brand-gold" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 lg:mb-12 text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-serif text-brand-navy mb-2 grayscale-0">Refer & Earn</h1>
        <p className="text-brand-navy/40 text-[10px] uppercase tracking-[0.3em] font-bold">Grow the elite circle</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Main Referral Card */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-brand-navy rounded-sm p-8 sm:p-12 lg:p-20 text-white relative overflow-hidden shadow-2xl mb-12">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 -skew-x-12 translate-x-1/2" />
            <div className="relative z-10 text-center lg:text-left">
              <div className="flex flex-col lg:flex-row items-center gap-6 mb-10">
                <div className="p-4 bg-brand-gold rounded-sm shrink-0">
                  <Gift className="text-brand-navy" size={28} />
                </div>
                <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-brand-gold animate-pulse tracking-wide">
                  Limited Time Professional Engagement
                </p>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-serif mb-8 leading-tight">
                Give ₹500, <br className="hidden lg:block" /> Get ₹500.
              </h2>
              <p className="text-white/60 text-base sm:text-lg mb-12 font-light leading-relaxed max-w-xl mx-auto lg:mx-0">
                Invite your network to experience premium AC care. They get a special introductory discount,
                and you earn credits for your next professional service visit.
              </p>

              <div className="bg-white/5 p-6 sm:p-10 rounded-sm border border-white/10 max-w-2xl mx-auto lg:mx-0">
                <p className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-4">
                  Your Professional Referral Code
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-grow bg-white/10 border border-white/20 px-6 py-4 rounded-sm text-lg sm:text-xl font-serif tracking-widest flex items-center justify-between overflow-hidden">
                    <span className="truncate">{referralCode}</span>
                    {copied && (
                      <span className="text-brand-gold text-[8px] uppercase animate-in fade-in shrink-0 ml-4">
                        Copied!
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopy}
                      disabled={referralCode === "—"}
                      className="flex-grow sm:flex-none bg-brand-gold text-brand-navy px-8 py-4 rounded-sm text-[10px] uppercase tracking-widest font-bold hover:bg-white transition-all whitespace-nowrap flex items-center justify-center gap-3 shadow-lg disabled:opacity-50"
                    >
                      {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                      {copied ? "Copied" : "Copy"}
                    </button>
                    <button
                      onClick={handleWhatsApp}
                      disabled={referralCode === "—"}
                      className="p-4 bg-green-600 text-white rounded-sm hover:bg-green-700 transition-all flex items-center justify-center shadow-lg disabled:opacity-50"
                    >
                      <MessageSquare size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* How it works */}
          <div className="bg-white p-6 sm:p-10 rounded-sm border border-brand-navy/5 shadow-sm">
            <h3 className="text-lg sm:text-xl font-serif text-brand-navy mb-8 sm:mb-10">How it works</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 md:gap-12">
              {[
                { step: "01", title: "Share Code", desc: "Send your unique referral code to your friends and family." },
                { step: "02", title: "They Book",  desc: "They get ₹500 off their first premium service using your code." },
                { step: "03", title: "You Earn",   desc: "You receive ₹500 in Coolzo credits once their service is done." },
              ].map((item, i) => (
                <div key={i} className="relative">
                  <span className="text-5xl sm:text-6xl font-serif text-brand-navy/5 absolute -top-4 -left-2">
                    {item.step}
                  </span>
                  <div className="relative z-10">
                    <h4 className="text-sm font-bold text-brand-navy mb-3">{item.title}</h4>
                    <p className="text-xs text-brand-navy/40 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Referral List */}
          <div className="bg-white p-6 sm:p-10 rounded-sm border border-brand-navy/5 shadow-sm">
            <h3 className="text-lg sm:text-xl font-serif text-brand-navy mb-8">My Referrals</h3>
            {referrals.length === 0 ? (
              <div className="py-12 text-center">
                <Users size={40} className="text-brand-navy/10 mx-auto mb-4" />
                <p className="text-brand-navy/40 text-sm">No referrals yet. Share your code to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {referrals.map((ref, i) => {
                  const isEarned = ref.status?.toLowerCase().includes("reward") || ref.status?.toLowerCase() === "booked";
                  return (
                    <div
                      key={i}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-5 sm:p-6 rounded-sm border border-brand-navy/5 hover:bg-brand-navy/5 transition-colors gap-4"
                    >
                      <div className="flex items-center gap-4 sm:gap-6">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-brand-navy/5 flex items-center justify-center text-brand-navy/40 shrink-0">
                          <Users size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-brand-navy">{ref.name}</p>
                          <p className="text-[9px] uppercase tracking-widest text-brand-navy/40">
                            {ref.date ? formatDate(ref.date) : "—"}
                          </p>
                        </div>
                      </div>
                      <div className="text-left sm:text-right flex sm:flex-col justify-between items-center sm:items-end w-full sm:w-auto">
                        <span className={`text-[8px] uppercase tracking-widest font-bold px-3 py-1 rounded-full sm:mb-1 ${
                          isEarned ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"
                        }`}>
                          {ref.status}
                        </span>
                        <p className="text-[10px] font-bold text-brand-navy">
                          {ref.reward != null ? `₹${ref.reward.toLocaleString()} Earned` : "Pending"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-sm border border-brand-navy/5 shadow-sm">
            <TrendingUp className="text-brand-gold mb-6" size={24} />
            <p className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40 mb-1">Total Credits Earned</p>
            <h3 className="text-4xl font-serif text-brand-navy mb-8">
              ₹{(stats?.totalRewardsEarned ?? 0).toLocaleString()}
            </h3>

            <div className="space-y-4 pt-8 border-t border-brand-navy/5">
              <div className="flex justify-between text-xs">
                <span className="text-brand-navy/40">Successful Referrals</span>
                <span className="text-brand-navy font-bold">{stats?.successfulReferrals ?? 0}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-brand-navy/40">Pending Invites</span>
                <span className="text-brand-navy font-bold">{stats?.pendingReferrals ?? 0}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-brand-navy/40">Loyalty Points</span>
                <span className="text-brand-navy font-bold">{(loyalty?.totalPoints ?? 0).toLocaleString()}</span>
              </div>
              {loyalty?.tier && (
                <div className="flex justify-between text-xs">
                  <span className="text-brand-navy/40">Membership Tier</span>
                  <span className="text-brand-navy font-bold">{loyalty.tier}</span>
                </div>
              )}
              {(loyalty?.expiringPoints ?? 0) > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="text-brand-navy/40">Expiring Soon</span>
                  <span className="text-brand-navy font-bold">
                    {loyalty?.expiringPoints?.toLocaleString()}
                    {loyalty?.expiryDate ? ` by ${formatDate(loyalty.expiryDate)}` : ""}
                  </span>
                </div>
              )}
            </div>

            <button className="w-full mt-8 bg-brand-navy text-white py-4 rounded-sm text-[10px] uppercase tracking-widest font-bold hover:bg-brand-gold transition-all">
              Redeem Credits
            </button>
          </div>

          <div className="bg-brand-gold/10 p-8 rounded-sm border border-brand-gold/20">
            <Award className="text-brand-gold mb-4" size={24} />
            <h4 className="text-sm font-bold text-brand-navy mb-2">Elite Ambassador</h4>
            <p className="text-xs text-brand-navy/60 leading-relaxed mb-6">
              Refer {AMBASSADOR_GOAL} friends to unlock the "Elite Ambassador" badge and get a free Luxury
              Jet Wash for your entire home.
            </p>
            <div className="h-2 bg-white rounded-full overflow-hidden mb-2">
              <motion.div
                className="h-full bg-brand-gold"
                initial={{ width: 0 }}
                animate={{ width: `${ambassadorProgress * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
            <p className="text-[8px] uppercase tracking-widest font-bold text-brand-navy/40 text-right">
              {successfulReferrals}/{AMBASSADOR_GOAL} Referrals
            </p>
          </div>

          <div className="bg-white p-8 rounded-sm border border-brand-navy/5 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="text-brand-gold" size={20} />
              <h4 className="text-sm font-bold text-brand-navy">Current Offers</h4>
            </div>

            {featuredOffers.length === 0 ? (
              <p className="text-xs text-brand-navy/40 leading-relaxed">
                No live promotional offers are available right now.
              </p>
            ) : (
              <div className="space-y-4">
                {featuredOffers.map((offer) => (
                  <div key={offer.offerId} className="rounded-sm border border-brand-navy/5 p-4">
                    <p className="text-sm font-bold text-brand-navy">{offer.title}</p>
                    {offer.description && (
                      <p className="mt-2 text-xs leading-relaxed text-brand-navy/50">
                        {offer.description}
                      </p>
                    )}
                    <div className="mt-3 flex items-center justify-between gap-4">
                      <span className="text-[8px] uppercase tracking-widest font-bold text-brand-gold">
                        {offer.couponCode || "Live Offer"}
                      </span>
                      {offer.validUntil && (
                        <span className="text-[8px] uppercase tracking-widest font-bold text-brand-navy/40">
                          Ends {formatDate(offer.validUntil)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
