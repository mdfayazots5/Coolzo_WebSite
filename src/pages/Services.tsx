import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Filter, Clock, Gem, ShieldCheck, Smartphone, ArrowRight, X, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { CatalogService, ACService } from "../services/catalogService";

const categories = [
  { id: "all", name: "All Services" },
  { id: "Repair", name: "Repair" },
  { id: "Maintenance", name: "Maintenance" },
  { id: "Installation", name: "Installation" },
  { id: "gas", name: "Gas" },
  { id: "Cleaning", name: "Cleaning" },
  { id: "amc", name: "AMC" },
];

export default function Services() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [services, setServices] = useState<ACService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await CatalogService.getServices();
        setServices(data);
      } catch (err) {
        console.error("Failed to fetch services:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchesCategory = activeCategory === "all" || service.category.toLowerCase() === activeCategory.toLowerCase();
      const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            service.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, services]);

  return (
    <div className="pt-32 pb-24 bg-brand-cream min-h-screen">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <span className="text-brand-gold text-[10px] uppercase tracking-[0.4em] font-bold mb-4 block">Service Catalog</span>
          <h1 className="text-6xl font-serif text-brand-navy mb-6">Expertise on Demand.</h1>
          <p className="text-brand-navy/50 text-lg font-light leading-relaxed">
            From precision repairs to smart installations, our certified technicians ensure your home remains perfectly tempered.
          </p>
        </div>

        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center gap-6">
            <Loader2 className="animate-spin text-brand-gold" size={40} />
            <p className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">Loading curated services...</p>
          </div>
        ) : (
          <>
            {/* Search & Filter Bar */}
            <div className="sticky top-24 z-30 bg-brand-cream/80 backdrop-blur-md py-6 border-y border-brand-navy/5 mb-12">
              <div className="flex flex-col lg:flex-row gap-8 justify-between items-center">
                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`px-6 py-2 rounded-sm text-[10px] uppercase tracking-widest font-bold transition-all duration-300 ${activeCategory === cat.id ? "bg-brand-navy text-white shadow-lg" : "bg-white text-brand-navy/60 hover:text-brand-navy border border-brand-navy/5"}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
                <div className="relative w-full lg:w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-navy/30" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search services..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-brand-navy/10 rounded-sm py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-brand-gold transition-colors"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-navy/30 hover:text-brand-navy"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredServices.map((service, i) => (
                  <motion.div
                    key={service.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="bg-white p-8 rounded-sm border border-brand-navy/5 hover:border-brand-gold/30 transition-all duration-500 group flex flex-col h-full shadow-sm hover:shadow-xl"
                  >
                    <div className="flex justify-between items-start mb-8">
                      <div className="text-brand-gold group-hover:scale-110 transition-transform duration-500">
                        {service.category === 'Repair' ? <ShieldCheck size={24} /> : <Clock size={24} />}
                      </div>
                      <span className="text-[9px] uppercase tracking-widest font-bold px-3 py-1 bg-brand-cream text-brand-gold rounded-sm">
                        ₹{service.price}
                      </span>
                    </div>
                    <h3 className="text-xl font-serif text-brand-navy mb-3">{service.name}</h3>
                    <p className="text-brand-navy/50 text-sm leading-relaxed mb-8 flex-grow line-clamp-3">{service.description}</p>
                    
                    <div className="flex items-center gap-4 mb-8 text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">
                      <div className="flex items-center gap-2">
                        <Clock size={14} />
                        {service.duration}
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <Link to={`/services/${service.id}`} className="text-[10px] uppercase tracking-widest font-bold text-brand-navy hover:text-brand-gold transition-colors flex items-center gap-2">
                        Learn More <ArrowRight size={12} />
                      </Link>
                      <Link to="/book" state={{ serviceId: service.id, serviceName: service.name, price: service.price }} className="bg-brand-navy text-white text-center py-4 rounded-sm text-[10px] uppercase tracking-widest font-bold hover:bg-brand-gold transition-all">
                        Book Now
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}

        {/* Empty State */}
        {filteredServices.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-32 text-center"
          >
            <div className="w-20 h-20 bg-brand-navy/5 rounded-full flex items-center justify-center mx-auto mb-8">
              <Search size={32} className="text-brand-navy/20" />
            </div>
            <h3 className="text-2xl font-serif text-brand-navy mb-4">No services found.</h3>
            <p className="text-brand-navy/40 max-w-sm mx-auto">
              We couldn't find any services matching your search or filter. Try adjusting your criteria.
            </p>
            <button 
              onClick={() => { setActiveCategory("all"); setSearchQuery(""); }}
              className="mt-8 text-brand-gold text-xs uppercase tracking-widest font-bold hover:text-brand-navy transition-colors"
            >
              Reset All Filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
