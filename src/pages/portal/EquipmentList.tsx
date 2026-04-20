import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, 
  Smartphone, 
  ChevronRight, 
  Calendar, 
  Search, 
  X, 
  Info,
  ArrowRight,
  MapPin
} from "lucide-react";
import { Link } from "react-router-dom";

const mockEquipment = [
  { id: "EQ-101", brand: "Samsung", model: "WindFree Pro", type: "Split", capacity: "1.5 Ton", location: "Living Room", lastService: "Mar 12, 2026", logo: "S" },
  { id: "EQ-102", brand: "Daikin", model: "FTKF Series", type: "Split", capacity: "1.0 Ton", location: "Master Bedroom", lastService: "Jan 15, 2026", logo: "D" },
  { id: "EQ-103", brand: "LG", model: "Dual Inverter", type: "Window", capacity: "1.5 Ton", location: "Guest Room", lastService: "Dec 20, 2025", logo: "L" },
];

export default function EquipmentList() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEquipment = mockEquipment.filter(eq => 
    eq.brand.toLowerCase().includes(searchTerm.toLowerCase()) || 
    eq.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div>
          <h1 className="text-4xl font-serif text-brand-navy mb-2">My Equipment</h1>
          <p className="text-brand-navy/40 text-[10px] uppercase tracking-[0.3em] font-bold">Manage your home's cooling assets</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-3 bg-brand-navy text-white px-8 py-4 rounded-sm text-[10px] uppercase tracking-widest font-bold hover:bg-brand-gold transition-all shadow-xl"
        >
          <Plus size={16} /> Add New Equipment
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-6 rounded-sm border border-brand-navy/5 shadow-sm mb-12 max-w-md">
        <div className="relative">
          <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-navy/30" />
          <input 
            type="text" 
            placeholder="Search by brand or location..."
            className="w-full bg-brand-navy/5 border border-transparent rounded-sm pl-14 pr-6 py-4 text-sm text-brand-navy focus:outline-none focus:border-brand-gold transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Equipment Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredEquipment.map((eq) => (
            <motion.div
              key={eq.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-sm border border-brand-navy/5 shadow-sm hover:shadow-xl transition-all group overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-8">
                  <div className="w-14 h-14 bg-brand-navy text-white rounded-sm flex items-center justify-center text-2xl font-serif">
                    {eq.logo}
                  </div>
                  <span className="bg-brand-navy/5 text-brand-navy/40 px-3 py-1 rounded-full text-[8px] uppercase tracking-widest font-bold">
                    {eq.type} • {eq.capacity}
                  </span>
                </div>

                <h3 className="text-2xl font-serif text-brand-navy mb-1">{eq.brand}</h3>
                <p className="text-sm text-brand-navy/40 mb-6">{eq.model}</p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-xs text-brand-navy/60">
                    <MapPin size={14} className="text-brand-gold" />
                    <span>{eq.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-brand-navy/60">
                    <Calendar size={14} className="text-brand-gold" />
                    <span>Last Service: {eq.lastService}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Link to={`/portal/equipment/${eq.id}`} className="text-center py-3 border border-brand-navy/10 rounded-sm text-[9px] uppercase tracking-widest font-bold text-brand-navy hover:bg-brand-navy hover:text-white transition-all">
                    View History
                  </Link>
                  <Link to="/book" className="text-center py-3 bg-brand-navy/5 rounded-sm text-[9px] uppercase tracking-widest font-bold text-brand-navy hover:bg-brand-gold transition-all">
                    Book Service
                  </Link>
                </div>
              </div>
              <div className="h-1 bg-brand-gold scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add New Placeholder */}
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-brand-navy/5 border-2 border-dashed border-brand-navy/10 rounded-sm p-8 flex flex-col items-center justify-center text-center group hover:border-brand-gold transition-all"
        >
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-brand-navy/20 group-hover:text-brand-gold transition-colors mb-4 shadow-sm">
            <Plus size={32} />
          </div>
          <h3 className="text-xl font-serif text-brand-navy/40 group-hover:text-brand-navy transition-colors">Register New Unit</h3>
          <p className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/20 mt-2">Personalize your service history</p>
        </button>
      </div>

      {/* Add Equipment Slide-over / Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="fixed inset-0 bg-brand-navy/60 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[110] shadow-2xl p-10 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-3xl font-serif text-brand-navy">Register Unit</h2>
                <button onClick={() => setIsAddModalOpen(false)} className="text-brand-navy/40 hover:text-brand-navy transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); setIsAddModalOpen(false); }}>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">Brand</label>
                  <select className="w-full bg-brand-navy/5 border border-transparent rounded-sm px-6 py-4 text-sm text-brand-navy focus:outline-none focus:border-brand-gold transition-colors appearance-none">
                    <option>Samsung</option>
                    <option>Daikin</option>
                    <option>LG</option>
                    <option>Mitsubishi</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">Model Name / Number</label>
                  <input type="text" placeholder="e.g. WindFree Pro" className="w-full bg-brand-navy/5 border border-transparent rounded-sm px-6 py-4 text-sm text-brand-navy focus:outline-none focus:border-brand-gold transition-colors" />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">Type</label>
                    <select className="w-full bg-brand-navy/5 border border-transparent rounded-sm px-6 py-4 text-sm text-brand-navy focus:outline-none focus:border-brand-gold transition-colors appearance-none">
                      <option>Split</option>
                      <option>Window</option>
                      <option>Cassette</option>
                      <option>Centralized</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">Capacity</label>
                    <select className="w-full bg-brand-navy/5 border border-transparent rounded-sm px-6 py-4 text-sm text-brand-navy focus:outline-none focus:border-brand-gold transition-colors appearance-none">
                      <option>1.0 Ton</option>
                      <option>1.5 Ton</option>
                      <option>2.0 Ton</option>
                      <option>3.0 Ton+</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">Installation Year</label>
                  <input type="number" placeholder="2024" className="w-full bg-brand-navy/5 border border-transparent rounded-sm px-6 py-4 text-sm text-brand-navy focus:outline-none focus:border-brand-gold transition-colors" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">Location Label</label>
                  <input type="text" placeholder="e.g. Living Room" className="w-full bg-brand-navy/5 border border-transparent rounded-sm px-6 py-4 text-sm text-brand-navy focus:outline-none focus:border-brand-gold transition-colors" />
                </div>

                <div className="pt-8">
                  <button type="submit" className="w-full bg-brand-navy text-white py-5 rounded-sm text-xs uppercase tracking-widest font-bold hover:bg-brand-gold hover:text-brand-navy transition-all shadow-xl flex items-center justify-center gap-3">
                    Save Equipment <ArrowRight size={16} />
                  </button>
                </div>
              </form>

              <div className="mt-12 p-6 bg-brand-gold/10 rounded-sm border border-brand-gold/20 flex gap-4">
                <Info size={20} className="text-brand-gold shrink-0" />
                <p className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/60 leading-relaxed">
                  Registering your equipment allows our technicians to arrive with the correct spare parts and tools for your specific model.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
