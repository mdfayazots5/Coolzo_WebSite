import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ChevronLeft, User, Clock, Share2, Facebook, Twitter, Loader2, AlertCircle } from "lucide-react";
import { CMSService } from "../services/cmsService";
import type { CMSBlockResponse } from "../services/cmsService";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2069&auto=format&fit=crop";

function meta(post: CMSBlockResponse, key: string): string {
  return (post.metadata?.[key] as string) ?? "";
}

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<CMSBlockResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    CMSService.getBlogByKey(id)
      .then(setPost)
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post?.title ?? "Coolzo Blog");
    if (platform === "facebook") window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
    if (platform === "twitter") window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, "_blank");
    if (platform === "native" && navigator.share) {
      navigator.share({ title: post?.title ?? "Coolzo Blog", url: window.location.href });
    }
  };

  return (
    <div className="pt-32 pb-24 bg-brand-cream min-h-screen">
      <div className="container mx-auto px-6">
        {/* Breadcrumb */}
        <Link
          to="/blog"
          className="flex items-center gap-2 text-brand-navy/40 hover:text-brand-navy text-[10px] uppercase tracking-widest font-bold mb-12 transition-colors group"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Registry
        </Link>

        {loading ? (
          <div className="py-32 flex justify-center">
            <Loader2 className="animate-spin text-brand-gold" size={40} />
          </div>
        ) : !post ? (
          <div className="py-32 text-center">
            <AlertCircle size={40} className="text-brand-navy/20 mx-auto mb-4" />
            <p className="text-brand-navy/40 text-sm">Article not found.</p>
            <Link
              to="/blog"
              className="mt-6 inline-block text-[10px] uppercase tracking-widest font-bold text-brand-gold hover:text-brand-navy transition-colors"
            >
              Return to Blog
            </Link>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="max-w-4xl mx-auto mb-12 lg:mb-16">
              {meta(post, "category") && (
                <span className="text-brand-gold-deep text-[10px] uppercase tracking-[0.4em] font-bold mb-6 block">
                  {meta(post, "category")}
                </span>
              )}
              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-serif text-brand-navy mb-10 leading-tight">
                {post.title ?? "Untitled Article"}
              </h1>
              <div className="flex flex-wrap items-center justify-between gap-8 border-y border-brand-navy/5 py-4 lg:py-8">
                <div className="flex flex-wrap items-center gap-6 lg:gap-12">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-brand-navy rounded-full flex items-center justify-center text-white font-serif italic">
                      {(meta(post, "author") || "C")[0]}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-brand-navy">{meta(post, "author") || "Coolzo Team"}</p>
                      <p className="text-[9px] uppercase tracking-widest text-brand-navy/40">
                        {meta(post, "authorTitle") || "Content Team"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8 text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">
                    {meta(post, "readTime") && (
                      <div className="flex items-center gap-2">
                        <Clock size={14} /> {meta(post, "readTime")}
                      </div>
                    )}
                    {meta(post, "date") && <div>{meta(post, "date")}</div>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleShare("facebook")}
                    aria-label="Share on Facebook"
                    className="w-11 h-11 flex items-center justify-center border border-brand-navy/10 rounded-lg hover:border-brand-gold transition-colors text-brand-navy/40 hover:text-brand-gold"
                  >
                    <Facebook size={18} aria-hidden="true" />
                  </button>
                  <button
                    onClick={() => handleShare("twitter")}
                    aria-label="Share on Twitter"
                    className="w-11 h-11 flex items-center justify-center border border-brand-navy/10 rounded-lg hover:border-brand-gold transition-colors text-brand-navy/40 hover:text-brand-gold"
                  >
                    <Twitter size={18} aria-hidden="true" />
                  </button>
                  <button
                    onClick={() => handleShare("native")}
                    aria-label="Share article"
                    className="w-11 h-11 flex items-center justify-center border border-brand-navy/10 rounded-lg hover:border-brand-gold transition-colors text-brand-navy/40 hover:text-brand-gold"
                  >
                    <Share2 size={18} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="max-w-3xl mx-auto mb-24">
              <img
                src={post.imageUrl || FALLBACK_IMG}
                alt={post.title ?? "Article"}
                className="w-full aspect-video object-cover rounded-sm mb-16 grayscale hover:grayscale-0 transition-all duration-1000"
                referrerPolicy="no-referrer"
              />
              {post.content ? (
                /* Render as HTML if content has tags, else as plain text */
                post.content.startsWith("<") ? (
                  <div
                    className="prose prose-brand max-w-none space-y-8 text-brand-navy/60 text-lg leading-relaxed font-light"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                ) : (
                  <div className="space-y-8 text-brand-navy/60 text-lg leading-relaxed font-light">
                    {post.content.split("\n\n").map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                )
              ) : (
                <p className="text-brand-navy/40 text-sm">Content coming soon.</p>
              )}
            </div>

            {/* Related — link back to blog list */}
            <div className="border-t border-brand-navy/5 pt-24 text-center">
              <Link
                to="/blog"
                className="text-[10px] uppercase tracking-widest font-bold text-brand-gold hover:text-brand-navy transition-colors"
              >
                ← Back to All Articles
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
