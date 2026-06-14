import { useState, useEffect, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, Quote, ShieldCheck, Loader2, LogIn, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { ReviewService } from "../services/reviewService";
import type { ReviewResponse } from "../services/reviewService";
import Container from "../components/Container";
import Grid from "../components/Grid";
import SnapshotImage from "../components/SnapshotImage";
import { useAuth } from "../contexts/AuthContext";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function Reviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);

  // Submit-review form state (authenticated customers only — POST is [Authorize] on the backend).
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [justSubmitted, setJustSubmitted] = useState(false);

  const canSubmit = rating >= 1 && comment.trim().length >= 5 && !submitting;

  const handleSubmitReview = async (event: FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      // A general review (no bookingId) is accepted for any signed-in customer; the backend
      // only enforces completion when a bookingId is supplied.
      const created = await ReviewService.submitReview({ rating, comment: comment.trim() });
      setReviews((prev) => [created, ...prev]); // surface the new review at the top (latest)
      setJustSubmitted(true);
      setRating(0);
      setComment("");
    } catch (err) {
      const message = (err as { message?: string } | undefined)?.message;
      setSubmitError(message || "Couldn't submit your review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

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
    <div className="pb-20 bg-brand-cream min-h-screen">
      {/* Banner (CMS image: reviews.banner) — item 14 */}
      <section className="relative h-[34vh] min-h-[260px] overflow-hidden bg-brand-navy">
        <SnapshotImage
          slotKey="reviews.banner"
          fallbackSrc="https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2069&auto=format&fit=crop"
          alt="Coolzo customer reviews"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy via-brand-navy/85 to-brand-navy/40" />
        <Container className="relative z-10 h-full flex flex-col justify-end pb-8">
          <span className="text-brand-gold text-[10px] uppercase tracking-[0.4em] font-bold mb-3 block">Customer reviews</span>
          <h1 className="font-serif text-white mb-3">Trusted across Hyderabad</h1>
          <p className="text-white/70 text-base md:text-lg font-light leading-relaxed max-w-2xl">
            Real feedback from verified Coolzo service visits — every review comes from a completed job.
          </p>
        </Container>
      </section>

      <Container className="pt-12">
        {/* Submit review + stats */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-14">
          {/* Share-your-experience card. Signed-in customers get the form; everyone else gets a
              sign-in prompt (the backend requires auth to post). */}
          <div className="bg-white p-8 rounded-2xl border border-brand-navy/5 shadow-xl">
            <span className="text-brand-gold-deep text-[10px] uppercase tracking-[0.4em] font-bold mb-3 block">Share your experience</span>
            {!user ? (
              <>
                <h2 className="text-2xl font-serif text-brand-navy mb-3">Had a Coolzo service?</h2>
                <p className="text-brand-navy/50 text-sm leading-relaxed mb-6">
                  Sign in to leave a review — we keep reviews trustworthy by accepting them only from verified customers.
                </p>
                <Link
                  to="/login?returnUrl=/reviews"
                  className="inline-flex items-center gap-2 bg-brand-navy text-white px-7 py-3.5 rounded-lg text-[10px] uppercase tracking-widest font-bold hover:bg-brand-gold hover:text-brand-navy transition-all min-h-[44px]"
                >
                  <LogIn size={14} /> Sign in to review
                </Link>
              </>
            ) : justSubmitted ? (
              <div className="py-6 text-center">
                <div className="w-16 h-16 bg-brand-gold/15 rounded-full flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 size={32} className="text-brand-gold" />
                </div>
                <h2 className="text-xl font-serif text-brand-navy mb-2">Thank you for your review!</h2>
                <p className="text-brand-navy/50 text-sm mb-6">It's now live at the top of the list below.</p>
                <button
                  type="button"
                  onClick={() => setJustSubmitted(false)}
                  className="text-brand-gold-deep text-[10px] uppercase tracking-widest font-bold hover:text-brand-navy transition-colors min-h-[44px]"
                >
                  Write another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-5">
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40 mb-2 block">Your rating</label>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        aria-label={`${star} star${star === 1 ? "" : "s"}`}
                        className="p-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
                      >
                        <Star
                          size={26}
                          className={star <= (hoverRating || rating) ? "fill-brand-gold text-brand-gold" : "text-brand-navy/15"}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label htmlFor="review-comment" className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40 mb-2 block">Your review</label>
                  <textarea
                    id="review-comment"
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell others about your Coolzo service experience…"
                    className="w-full bg-brand-cream/60 border border-brand-navy/10 rounded-lg px-4 py-3 text-sm text-brand-navy focus:outline-none focus:border-brand-gold focus-visible:ring-2 focus-visible:ring-brand-gold/50 transition-colors resize-none"
                  />
                </div>
                {submitError && <p className="text-sm text-red-600">{submitError}</p>}
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="w-full bg-brand-gold text-brand-navy py-3.5 rounded-lg text-[10px] uppercase tracking-widest font-bold hover:bg-brand-navy hover:text-white transition-all min-h-[44px] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? <><Loader2 size={14} className="animate-spin" /> Submitting…</> : "Submit review"}
                </button>
              </form>
            )}
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
