import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MapPin, 
  Plus, 
  Home, 
  Briefcase, 
  MoreVertical, 
  CheckCircle2, 
  X, 
  ArrowRight,
  Info,
  Trash2,
  Star
} from "lucide-react";

const mockAddresses = [
  { id: "ADDR-1", label: "Home", address: "Apt 4B, 2nd Floor, Building 12, Hyderabad", city: "Hyderabad", pin: "500033", isDefault: true, zone: "Zone A" },
  { id: "ADDR-2", label: "Office", address: "Suite 502, Tech Park Tower, Secunderabad", city: "Secunderabad", pin: "500003", isDefault: false, zone: "Zone B" },
];

export default function Addresses() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [pinCode, setPinCode] = useState("");
  const [isZoneValid, setIsZoneValid] = useState<boolean | null>(null);

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPinCode(val);
    if (val.length === 6) {
      // Simulate zone validation
      setIsZoneValid(val.startsWith("50"));
    } else {
      setIsZoneValid(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 mb-12">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif text-brand-navy mb-2 grayscale-0">My Addresses</h1>
          <p className="text-brand-navy/40 text-[10px] uppercase tracking-[0.3em] font-bold">Manage your service locations</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-3 bg-brand-navy text-white px-8 py-4 rounded-sm text-[10px] uppercase tracking-widest font-bold hover:bg-brand-gold transition-all shadow-xl"
        >
          <Plus size={16} /> Add New Address
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mockAddresses.map((addr) => (
          <motion.div
            key={addr.id}
            className="bg-white rounded-sm border border-brand-navy/5 shadow-sm hover:shadow-xl transition-all group overflow-hidden"
          >
            <div className="p-8">
              <div className="flex justify-between items-start mb-8">
                <div className="w-12 h-12 bg-brand-navy/5 rounded-sm flex items-center justify-center text-brand-gold">
                  {addr.label === 'Home' ? <Home size={24} /> : addr.label === 'Office' ? <Briefcase size={24} /> : <MapPin size={24} />}
                </div>
                <div className="flex items-center gap-2">
                  {addr.isDefault && (
                    <span className="bg-brand-gold/10 text-brand-gold px-3 py-1 rounded-full text-[8px] uppercase tracking-widest font-bold flex items-center gap-1">
                      <Star size={8} className="fill-brand-gold" /> Default
                    </span>
                  )}
                  <button className="p-2 text-brand-navy/20 hover:text-brand-navy transition-colors">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-serif text-brand-navy mb-4">{addr.label}</h3>
              <p className="text-sm text-brand-navy/60 leading-relaxed mb-6 h-12 overflow-hidden">
                {addr.address}
              </p>

              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  <CheckCircle2 size={10} /> {addr.zone}
                </div>
                <span className="text-[9px] uppercase tracking-widest font-bold text-brand-navy/40">{addr.pin}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button className="text-center py-3 border border-brand-navy/10 rounded-sm text-[9px] uppercase tracking-widest font-bold text-brand-navy hover:bg-brand-navy hover:text-white transition-all">
                  Edit
                </button>
                {!addr.isDefault && (
                  <button className="text-center py-3 bg-brand-navy/5 rounded-sm text-[9px] uppercase tracking-widest font-bold text-brand-navy hover:bg-brand-gold transition-all">
                    Set Default
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {/* Add New Placeholder */}
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-brand-navy/5 border-2 border-dashed border-brand-navy/10 rounded-sm p-8 flex flex-col items-center justify-center text-center group hover:border-brand-gold transition-all"
        >
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-brand-navy/20 group-hover:text-brand-gold transition-colors mb-4 shadow-sm">
            <Plus size={32} />
          </div>
          <h3 className="text-xl font-serif text-brand-navy/40 group-hover:text-brand-navy transition-colors">Add New Address</h3>
          <p className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/20 mt-2">Faster bookings await</p>
        </button>
      </div>

      {/* Add Address Modal */}
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
              className="fixed top-0 right-0 h-full w-full sm:max-w-md bg-white z-[110] shadow-2xl p-6 sm:p-10 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl font-serif text-brand-navy">Add Address</h2>
                <button onClick={() => setIsAddModalOpen(false)} className="text-brand-navy/40 hover:text-brand-navy transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form className="space-y-6 sm:space-y-8" onSubmit={(e) => { e.preventDefault(); setIsAddModalOpen(false); }}>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">Address Label</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Home', 'Office', 'Other'].map(label => (
                      <button 
                        key={label}
                        type="button"
                        className="py-3 border border-brand-navy/10 rounded-sm text-[9px] uppercase tracking-widest font-bold text-brand-navy hover:bg-brand-navy hover:text-white transition-all"
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">Address Line 1</label>
                  <input type="text" placeholder="House / Flat No., Building Name" className="w-full bg-brand-navy/5 border border-transparent rounded-sm px-6 py-4 text-sm text-brand-navy focus:outline-none focus:border-brand-gold transition-colors" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">Address Line 2</label>
                  <input type="text" placeholder="Street, Area, Landmark" className="w-full bg-brand-navy/5 border border-transparent rounded-sm px-6 py-4 text-sm text-brand-navy focus:outline-none focus:border-brand-gold transition-colors" />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">City</label>
                    <input type="text" defaultValue="Hyderabad" className="w-full bg-brand-navy/5 border border-transparent rounded-sm px-6 py-4 text-sm text-brand-navy focus:outline-none focus:border-brand-gold transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">PIN Code</label>
                    <input 
                      type="text" 
                      maxLength={6}
                      value={pinCode}
                      onChange={handlePinChange}
                      placeholder="500033" 
                      className="w-full bg-brand-navy/5 border border-transparent rounded-sm px-6 py-4 text-sm text-brand-navy focus:outline-none focus:border-brand-gold transition-colors" 
                    />
                  </div>
                </div>

                {isZoneValid !== null && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-sm flex items-center gap-3 ${isZoneValid ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-500 border border-red-100'}`}
                  >
                    {isZoneValid ? <CheckCircle2 size={16} /> : <Info size={16} />}
                    <span className="text-[10px] uppercase tracking-widest font-bold">
                      {isZoneValid ? 'Service Available in this area' : 'Service not yet available here'}
                    </span>
                  </motion.div>
                )}

                <div className="pt-8">
                  <button type="submit" className="w-full bg-brand-navy text-white py-5 rounded-sm text-xs uppercase tracking-widest font-bold hover:bg-brand-gold hover:text-brand-navy transition-all shadow-xl flex items-center justify-center gap-3">
                    Save Address <ArrowRight size={16} />
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
