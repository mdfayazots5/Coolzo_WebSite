import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Clock, User, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { CMSService } from "../services/cmsService";
import type { CMSBlockResponse } from "../services/cmsService";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2069&auto=format&fit=crop";

function postCategory(post: CMSBlockResponse): string {
  return (post.metadata?.category as string) ?? "";
}
function postAuthor(post: CMSBlockResponse): string {
  return (post.metadata?.author as string) ?? "Coolzo Team";
}
function postDate(post: CMSBlockResponse): string {
  return (post.metadata?.date as string) ?? "";
}
function postReadTime(post: CMSBlockResponse): string {
  return (post.metadata?.readTime as string) ?? "";
}
function postExcerpt(post: CMSBlockResponse): string {
  const content = post.content ?? "";
  return content.length > 160 ? content.slice(0, 157) + "..." : content;
}

export default function Blog() {
  const [posts, setPosts] = useState<CMSBlockResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All Articles");

  useEffect(() => {
    CMSService.getBlogs()
      .then((data) => setPosts(data ?? []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  // Derive category list from loaded posts
  const categories = [
    "All Articles",
    ...Array.from(new Set(posts.map(postCategory).filter(Boolean))),
  ];

  const filteredPosts =
    activeCategory === "All Articles"
      ? posts
      : posts.filter((p) => postCategory(p) === activeCategory);

  const featuredPost = filteredPosts[0];
  const remainingPosts = filteredPosts.slice(1);

  return (
    <div className="pt-32 pb-24 bg-brand-cream min-h-screen">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          <span className="text-brand-gold text-[10px] uppercase tracking-[0.4em] font-bold mb-4 block">Knowledge Center</span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-brand-navy mb-8">Professional Insights.</h1>
          <p className="text-brand-navy/50 text-xl font-light leading-relaxed">
            Guides, perspectives, and expert advice on the art of climate care.
          </p>
        </div>

        {/* Category Filter */}
        {categories.length > 1 && (
          <div className="flex flex-wrap gap-4 mb-16 border-b border-brand-navy/5 pb-8 relative z-20">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-lg text-[10px] uppercase tracking-widest font-bold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? "bg-brand-navy text-white shadow-md"
                    : "bg-white text-brand-navy/60 hover:text-brand-navy border border-brand-navy/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="py-32 flex justify-center">
            <Loader2 className="animate-spin text-brand-gold" size={40} />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {/* Featured Post */}
              {featuredPost && (
                <Link to={`/blog/${featuredPost.blockKey}`} className="block group mb-24">
                  <div className="relative aspect-[21/9] overflow-hidden rounded-sm mb-12">
                    <img
                      src={featuredPost.imageUrl || FALLBACK_IMG}
                      alt={featuredPost.title ?? "Blog post"}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-transparent to-transparent" />
                    <div className="absolute bottom-12 left-12 right-12 text-white">
                      {postCategory(featuredPost) && (
                        <span className="text-brand-gold text-[10px] uppercase tracking-widest font-bold mb-4 block">
                          {postCategory(featuredPost)}
                        </span>
                      )}
                      <h2 className="text-5xl font-serif mb-6 max-w-3xl leading-tight group-hover:text-brand-gold transition-colors">
                        {featuredPost.title ?? "Featured Article"}
                      </h2>
                      <div className="flex items-center gap-8 text-[10px] uppercase tracking-widest font-bold opacity-60">
                        <div className="flex items-center gap-2">
                          <User size={14} /> {postAuthor(featuredPost)}
                        </div>
                        {postReadTime(featuredPost) && (
                          <div className="flex items-center gap-2">
                            <Clock size={14} /> {postReadTime(featuredPost)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* Grid */}
              {remainingPosts.length > 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                  {remainingPosts.map((post, i) => (
                    <motion.div
                      key={post.blockKey}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="group"
                    >
                      <Link to={`/blog/${post.blockKey}`} className="block">
                        <div className="aspect-[4/3] overflow-hidden rounded-sm mb-8 grayscale group-hover:grayscale-0 transition-all duration-700">
                          <img
                            src={post.imageUrl || FALLBACK_IMG}
                            alt={post.title ?? "Article"}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        {postCategory(post) && (
                          <span className="text-brand-gold text-[9px] uppercase tracking-widest font-bold mb-4 block">
                            {postCategory(post)}
                          </span>
                        )}
                        <h3 className="text-2xl font-serif text-brand-navy mb-4 group-hover:text-brand-gold transition-colors leading-tight">
                          {post.title ?? "Article"}
                        </h3>
                        <p className="text-brand-navy/50 text-sm leading-relaxed mb-8 line-clamp-2 font-light">
                          {postExcerpt(post)}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-[9px] uppercase tracking-widest font-bold text-brand-navy/30">
                            {postDate(post) && <span>{postDate(post)}</span>}
                            {postReadTime(post) && <span>{postReadTime(post)}</span>}
                          </div>
                          <ArrowRight size={18} className="text-brand-gold group-hover:translate-x-2 transition-transform" />
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}

              {!loading && filteredPosts.length === 0 && (
                <div className="py-32 text-center">
                  <p className="text-brand-navy/40 text-sm">No articles found.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Newsletter */}
        <div className="mt-32 bg-brand-navy p-12 md:p-24 rounded-xl text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-gold/5 skew-x-12 translate-x-1/4" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="text-brand-gold text-[10px] uppercase tracking-[0.4em] font-bold mb-6 block">Stay Informed</span>
            <h2 className="text-4xl font-serif text-white mb-8">The Professional Newsletter.</h2>
            <p className="text-white/40 text-sm leading-relaxed mb-12">
              Receive curated insights on climate care and modern home management directly in your inbox.
            </p>
            <form className="flex flex-col md:flex-row gap-4">
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <input
                id="newsletter-email"
                type="email"
                placeholder="Your email address"
                className="flex-grow bg-white/5 border border-white/10 rounded-lg px-6 py-4 text-white text-sm focus:outline-none focus:border-brand-gold focus-visible:ring-2 focus-visible:ring-brand-gold/60 transition-colors"
              />
              <button
                type="submit"
                className="bg-brand-gold text-brand-navy px-10 py-4 rounded-lg text-[10px] uppercase tracking-widest font-bold hover:bg-white transition-all"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
