import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, ArrowRight, Clock, User } from "lucide-react";
import { Link } from "react-router-dom";

const posts = [
  { id: 1, title: "The Art of Professional Maintenance", excerpt: "How proactive care extends the life of high-spec HVAC systems in modern environments.", category: "Maintenance Tips", author: "Sarah Chen", date: "Oct 12, 2025", readTime: "5 min read", img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2069&auto=format&fit=crop" },
  { id: 2, title: "Preparing Your Home for Peak Summer", excerpt: "A 12-point checklist for ensuring zero downtime during the most demanding months of the year.", category: "Seasonal Guides", author: "Marcus Thorne", date: "Sep 28, 2025", readTime: "8 min read", img: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=2070&auto=format&fit=crop" },
  { id: 3, title: "Energy Efficiency in Modern Architecture", excerpt: "Balancing expansive glass facades with sustainable cooling protocols without compromising comfort.", category: "Energy Efficiency", author: "Elena Rossi", date: "Sep 15, 2025", readTime: "12 min read", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop" },
  { id: 4, title: "The Evolution of Smart Climate Control", excerpt: "Integrating advanced HVAC systems with modern home automation for a seamless living experience.", category: "Installation Advice", author: "Sarah Chen", date: "Aug 30, 2025", readTime: "6 min read", img: "https://images.unsplash.com/photo-1558389186-438424b00a32?q=80&w=2070&auto=format&fit=crop" },
];

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState("All Articles");

  const filteredPosts = activeCategory === "All Articles" 
    ? posts 
    : posts.filter(post => post.category === activeCategory);

  const featuredPost = filteredPosts[0];
  const remainingPosts = filteredPosts.slice(1);

  return (
    <div className="pt-32 pb-24 bg-brand-cream min-h-screen">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-24">
          <span className="text-brand-gold text-[10px] uppercase tracking-[0.4em] font-bold mb-4 block">Knowledge Center</span>
          <h1 className="text-6xl font-serif text-brand-navy mb-8">Professional Insights.</h1>
          <p className="text-brand-navy/50 text-xl font-light leading-relaxed">
            Guides, perspectives, and expert advice on the art of climate care.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-4 mb-16 border-b border-brand-navy/5 pb-8 relative z-20">
          {['All Articles', 'Maintenance Tips', 'Seasonal Guides', 'Energy Efficiency', 'Installation Advice'].map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-sm text-[10px] uppercase tracking-widest font-bold transition-all cursor-pointer ${activeCategory === cat ? "bg-brand-navy text-white shadow-md" : "bg-white text-brand-navy/60 hover:text-brand-navy border border-brand-navy/5"}`}
            >
              {cat}
            </button>
          ))}
        </div>

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
              <Link to={`/blog/${featuredPost.id}`} className="block group mb-24">
                <div className="relative aspect-[21/9] overflow-hidden rounded-sm mb-12">
                  <img 
                    src={featuredPost.img} 
                    alt={featuredPost.title} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-transparent to-transparent" />
                  <div className="absolute bottom-12 left-12 right-12 text-white">
                    <span className="text-brand-gold text-[10px] uppercase tracking-widest font-bold mb-4 block">{featuredPost.category}</span>
                    <h2 className="text-5xl font-serif mb-6 max-w-3xl leading-tight group-hover:text-brand-gold transition-colors">{featuredPost.title}</h2>
                    <div className="flex items-center gap-8 text-[10px] uppercase tracking-widest font-bold opacity-60">
                      <div className="flex items-center gap-2"><User size={14} /> {featuredPost.author}</div>
                      <div className="flex items-center gap-2"><Clock size={14} /> {featuredPost.readTime}</div>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
              {remainingPosts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group"
                >
                  <Link to={`/blog/${post.id}`} className="block">
                    <div className="aspect-[4/3] overflow-hidden rounded-sm mb-8 grayscale group-hover:grayscale-0 transition-all duration-700">
                      <img src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                    </div>
                    <span className="text-brand-gold text-[9px] uppercase tracking-widest font-bold mb-4 block">{post.category}</span>
                    <h3 className="text-2xl font-serif text-brand-navy mb-4 group-hover:text-brand-gold transition-colors leading-tight">{post.title}</h3>
                    <p className="text-brand-navy/50 text-sm leading-relaxed mb-8 line-clamp-2 font-light">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-[9px] uppercase tracking-widest font-bold text-brand-navy/30">
                        <span>{post.date}</span>
                        <span>{post.readTime}</span>
                      </div>
                      <ArrowRight size={18} className="text-brand-gold group-hover:translate-x-2 transition-transform" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Newsletter */}
        <div className="mt-32 bg-brand-navy p-12 md:p-24 rounded-sm text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-gold/5 skew-x-12 translate-x-1/4" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="text-brand-gold text-[10px] uppercase tracking-[0.4em] font-bold mb-6 block">Stay Informed</span>
            <h2 className="text-4xl font-serif text-white mb-8">The Professional Newsletter.</h2>
            <p className="text-white/40 text-sm leading-relaxed mb-12">
              Receive curated insights on climate care and modern home management directly in your inbox.
            </p>
            <form className="flex flex-col md:flex-row gap-4">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-grow bg-white/5 border border-white/10 rounded-sm px-6 py-4 text-white text-sm focus:outline-none focus:border-brand-gold transition-colors"
              />
              <button className="bg-brand-gold text-brand-navy px-10 py-4 rounded-sm text-[10px] uppercase tracking-widest font-bold hover:bg-white transition-all">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
