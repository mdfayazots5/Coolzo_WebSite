import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Star, 
  CheckCircle2, 
  ArrowRight, 
  User, 
  Calendar, 
  Smartphone,
  ChevronLeft,
  Loader2
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { ReviewService } from "../../services/reviewService";
import { BookingService, Booking } from "../../services/bookingService";

export default function Feedback() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!id) return;
      try {
        const data = await BookingService.getBookingDetail(id);
        if (data) setBooking(data);
      } catch (error) {
        console.error("Error fetching booking for feedback:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !rating) return;

    setIsSubmitting(true);
    try {
      await ReviewService.submitReview({
        userId: user.uid,
        userName: user.displayName || "Client",
        rating,
        comment,
        serviceId: booking?.serviceId
      });
      setIsSubmitted(true);
    } catch (error) {
      console.error("Feedback submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-brand-gold" size={40} />
      </div>
    );
  }

  const service = {
    id: booking?.id || id || "SR-88210",
    type: booking?.serviceName || "AC Service",
    date: booking?.date || "Mar 12, 2026",
    technician: booking?.technician?.name || "Rahul K.",
    techPhoto: booking?.technician?.image || "https://picsum.photos/seed/tech2/100/100"
  };

  if (isSubmitted) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-12 rounded-sm border border-brand-navy/5 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-brand-gold" />
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={40} className="text-green-600" />
          </div>
          <h2 className="text-3xl font-serif text-brand-navy mb-4">Thank You.</h2>
          <p className="text-brand-navy/50 text-sm mb-10 leading-relaxed">
            Your feedback helps us maintain the highest standards of premium service. We've shared your appreciation with {service.technician}.
          </p>
          <div className="space-y-4">
            <Link 
              to="/book"
              className="w-full bg-brand-navy text-white py-4 rounded-sm text-[10px] uppercase tracking-widest font-bold hover:bg-brand-gold transition-all flex items-center justify-center gap-3 shadow-xl"
            >
              Book Next Service <ArrowRight size={16} />
            </Link>
            <button 
              onClick={() => navigate("/portal")}
              className="w-full py-4 text-[10px] uppercase tracking-widest font-bold text-brand-navy/40 hover:text-brand-navy transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-12">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-brand-navy/40 hover:text-brand-navy text-[10px] uppercase tracking-widest font-bold transition-colors mb-8">
          <ChevronLeft size={14} /> Back
        </button>
        <h1 className="text-4xl font-serif text-brand-navy mb-2">Service Feedback</h1>
        <p className="text-brand-navy/40 text-[10px] uppercase tracking-[0.3em] font-bold">Rate your experience</p>
      </div>

      <div className="bg-white p-10 md:p-12 rounded-sm border border-brand-navy/5 shadow-sm">
        {/* Service Summary */}
        <div className="flex items-center gap-8 p-8 bg-brand-navy/5 rounded-sm mb-12">
          <div className="w-20 h-20 rounded-full border-2 border-brand-gold p-1 shrink-0">
            <img src={service.techPhoto} alt={service.technician} className="w-full h-full rounded-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-brand-gold mb-1">{service.id}</p>
            <h3 className="text-xl font-serif text-brand-navy">{service.type}</h3>
            <p className="text-xs text-brand-navy/40 mt-1">Performed by {service.technician} on {service.date}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Main Star Rating */}
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40 mb-6">Overall Experience</p>
            <div className="flex justify-center gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  type="button"
                  onMouseEnter={() => setHoverRating(i)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(i)}
                  className="p-2 transition-transform hover:scale-125"
                >
                  <Star 
                    size={48} 
                    className={`${
                      (hoverRating || rating) >= i ? 'text-brand-gold fill-brand-gold' : 'text-brand-navy/10'
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Sub-ratings */}
          <div className="grid md:grid-cols-3 gap-8 pt-12 border-t border-brand-navy/5">
            {[
              { label: "Punctuality", icon: <Calendar size={16} /> },
              { label: "Professionalism", icon: <User size={16} /> },
              { label: "Work Quality", icon: <Smartphone size={16} /> },
            ].map((dim, i) => (
              <div key={i} className="text-center">
                <div className="text-brand-gold mb-3 flex justify-center">{dim.icon}</div>
                <p className="text-[9px] uppercase tracking-widest font-bold text-brand-navy/60 mb-4">{dim.label}</p>
                <div className="flex justify-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} type="button" className="text-brand-navy/10 hover:text-brand-gold transition-colors">
                      <Star size={14} className="fill-current" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Written Review */}
          <div className="space-y-4">
            <label className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">Your Comments (Optional)</label>
            <textarea 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us what you loved or how we can improve..."
              className="w-full bg-brand-navy/5 border border-transparent rounded-sm px-6 py-4 text-sm text-brand-navy focus:outline-none focus:border-brand-gold transition-colors h-32 resize-none"
            />
          </div>

          {/* Recommendation Toggle */}
          <div className="flex items-center justify-between p-6 bg-brand-navy/5 rounded-sm">
            <p className="text-[10px] uppercase tracking-widest font-bold text-brand-navy">Would you recommend Coolzo to others?</p>
            <div className="flex gap-4">
              <button type="button" className="px-6 py-2 bg-white border border-brand-navy/10 rounded-sm text-[9px] uppercase tracking-widest font-bold text-brand-navy hover:bg-brand-navy hover:text-white transition-all">Yes</button>
              <button type="button" className="px-6 py-2 bg-white border border-brand-navy/10 rounded-sm text-[9px] uppercase tracking-widest font-bold text-brand-navy hover:bg-brand-navy hover:text-white transition-all">No</button>
            </div>
          </div>

          <button 
            type="submit"
            disabled={rating === 0 || isSubmitting}
            className={`w-full bg-brand-navy text-white py-5 rounded-sm text-xs uppercase tracking-widest font-bold hover:bg-brand-gold hover:text-brand-navy transition-all shadow-xl flex items-center justify-center gap-3 ${
              (rating === 0 || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : "Submit Review"}
            {!isSubmitting && <ArrowRight size={16} />}
          </button>
        </form>
      </div>
    </div>
  );
}
