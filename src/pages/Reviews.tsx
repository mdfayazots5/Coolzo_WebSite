import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, Quote, ShieldCheck, Loader2 } from "lucide-react";
import { ReviewService } from "../services/reviewService";
import type { ReviewResponse } from "../services/reviewService";
import Container from "../components/Container";
import Grid from "../components/Grid";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function Reviews() {
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);

  useEffect(() => {
    setLoading(true);
    ReviewService.getReviews(undefined, page, 12)
      .then((result) => {
        setReviews((prev) => (page === 1 ? (result.items ?? []) : [...prev, ...(result.items ?? [])]));
        setHasNext(result.hasNext ?? false);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  const avgRating = reviews.length
    ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
    : null;
  const dist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach((r) => { dist[r.rating] = (dist[r.rating] ?? 0) + 1; });

  return (
    <div className="pt-28 pb-20 bg-brand-cream min-h-screen">
      <Container>
        {/* Header + stats */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-14">
          <div>
            <span className="text-brand-gold-deep text-[10px] uppercase tracking-[0.4em] font-bold mb-3 block">Customer reviews</span>
            <h1 className="font-serif text-brand-navy mb-4">Trusted across Hyderabad</h1>
            <p className="text-brand-navy/50 text-base md:text-lg font-light leading-relaxed">
              Real feedback from verified Coolzo service visits — every review comes from a completed job.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-brand-navy/5 shadow-xl text-center">
            {avgRating != null ? (
              <>
                <p className="text-6xl font-serif text-brand-navy mb-2">{avgRating.toFixed(1)}</p>
                <div className="flex justify-center gap-1 text-brand-gold mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={18} className={i <= Math.round(avgRating) ? "fill-brand-gold" : "text-brand-navy/15"} />
                  ))}
                </div>
                <p className="text-brand-navy/40 text-[10px] uppercase tracking-widest font-bold mb-6">
                  Based on {reviews.length} verified review{reviews.length === 1 ? "" : "s"}
                </p>
                <div className="space-y-2.5 max-w-xs mx-auto">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const pct = reviews.length ? Math.round((dist[star] / reviews.length) * 100) : 0;
                    return (
                      <div key={star} className="flex items-center gap-3">
                        <span className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40 w-3">{star}</span>
                        <div className="flex-grow h-1.5 bg-brand-navy/5 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-gold" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40 w-8">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="py-6">
                <ShieldCheck size={40} className="text-brand-gold mx-auto mb-4" />
                <p className="text-brand-navy/50 text-sm">Reviews from completed services will appear here.</p>
              </div>
            )}
          </div>
        </div>

        {/* Review grid */}
        {loading && page === 1 ? (
          <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-brand-gold" size={36} /></div>
        ) : reviews.length === 0 ? (
          <div className="py-16 text-center">
            <Quote size={40} className="text-brand-navy/15 mx-auto mb-4" />
            <p className="text-brand-navy/40 text-sm">No reviews yet — be the first after your service.</p>
          </div>
        ) : (
          <>
            <Grid cols={3}>
              <AnimatePresence mode="popLayout">
                {reviews.map((review, i) => (
                  <motion.div
                    key={review.reviewId}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ delay: Math.min(i * 0.04, 0.3) }}
                    className="bg-white p-7 rounded-xl border border-brand-navy/5 hover:border-brand-gold/30 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-1 text-brand-gold">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Star key={j} size={14} className={j < review.rating ? "fill-brand-gold" : "text-brand-navy/15"} />
                        ))}
                      </div>
                      <span className="text-[9px] uppercase tracking-widest font-bold text-brand-navy/30">{formatDate(review.dateCreated)}</span>
                    </div>
                    <Quote className="text-brand-gold/15 mb-3" size={28} />
                    <p className="text-brand-navy/70 text-base italic font-serif leading-relaxed mb-6 flex-grow">"{review.comment}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-navy/5 rounded-full flex items-center justify-center text-brand-navy font-serif italic shrink-0">
                        {review.customerName?.[0] ?? "C"}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-brand-navy">{review.customerName}</p>
                        {review.serviceName && (
                          <p className="text-[9px] uppercase tracking-widest font-bold text-brand-gold">{review.serviceName}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </Grid>

            {hasNext && (
              <div className="text-center mt-10">
                <button
                  type="button"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={loading}
                  className="px-10 py-4 border border-brand-navy/10 rounded-lg text-[10px] uppercase tracking-widest font-bold text-brand-navy hover:bg-brand-navy hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-3 mx-auto min-h-[44px]"
                >
                  {loading ? <Loader2 size={14} className="animate-spin" /> : null}
                  Load more reviews
                </button>
              </div>
            )}
          </>
        )}
      </Container>
    </div>
  );
}
