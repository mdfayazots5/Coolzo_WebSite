import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { 
  ChevronLeft, 
  Smartphone, 
  Calendar, 
  ShieldCheck, 
  Clock, 
  User, 
  Download, 
  ArrowRight,
  Settings,
  MapPin,
  CheckCircle2
} from "lucide-react";

export default function EquipmentDetail() {
  const { id } = useParams();

  const equipment = {
    id: id || "EQ-101",
    brand: "Samsung",
    model: "WindFree Pro",
    serial: "SN-99281-CZ",
    type: "Split",
    capacity: "1.5 Ton",
    installYear: "2024",
    location: "Living Room",
  };

  const history = [
    { id: "SR-88291", date: "Apr 10, 2026", type: "Precision Repair", technician: "Vikram Singh", status: "In Progress" },
    { id: "SR-88210", date: "Mar 12, 2026", type: "Deep Jet Wash", technician: "Rahul K.", status: "Completed" },
    { id: "SR-87550", date: "Nov 05, 2025", type: "Installation", technician: "Suresh M.", status: "Completed" },
  ];

  const warranties = [
    { part: "Inverter Compressor", period: "10 Years", expiry: "Nov 2035", status: "Active" },
    { part: "PCB & Electronics", period: "1 Year", expiry: "Nov 2026", status: "Active" },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <Link to="/portal/equipment" className="flex items-center gap-2 text-brand-navy/40 hover:text-brand-navy text-[10px] uppercase tracking-widest font-bold transition-colors">
          <ChevronLeft size={14} /> Back to Equipment
        </Link>
        <button className="flex items-center gap-2 px-6 py-2 border border-brand-navy/10 rounded-sm text-[9px] uppercase tracking-widest font-bold text-brand-navy hover:bg-brand-navy hover:text-white transition-all">
          <Settings size={14} /> Edit Details
        </button>
      </div>

      {/* Equipment Identity */}
      <div className="bg-white p-10 md:p-12 rounded-sm border border-brand-navy/5 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="flex items-center gap-8">
            <div className="w-20 h-20 bg-brand-navy text-white rounded-sm flex items-center justify-center text-4xl font-serif">
              {equipment.brand[0]}
            </div>
            <div>
              <div className="flex items-center gap-4 mb-3">
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-gold">{equipment.id}</span>
                <span className="bg-brand-navy/5 text-brand-navy/40 px-3 py-1 rounded-full text-[8px] uppercase tracking-widest font-bold">{equipment.type}</span>
              </div>
              <h1 className="text-4xl font-serif text-brand-navy mb-1">{equipment.brand} {equipment.model}</h1>
              <p className="text-sm text-brand-navy/40">{equipment.location} • Installed {equipment.installYear}</p>
            </div>
          </div>
          <Link to="/book" className="bg-brand-gold text-brand-navy px-10 py-4 rounded-sm text-[10px] uppercase tracking-widest font-bold hover:bg-brand-navy hover:text-white transition-all shadow-xl">
            Book Service for This Unit
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 pt-12 border-t border-brand-navy/5">
          <div>
            <p className="text-[9px] uppercase tracking-widest font-bold text-brand-navy/40 mb-1">Capacity</p>
            <p className="text-sm font-bold text-brand-navy">{equipment.capacity}</p>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-widest font-bold text-brand-navy/40 mb-1">Serial Number</p>
            <p className="text-sm font-bold text-brand-navy">{equipment.serial}</p>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-widest font-bold text-brand-navy/40 mb-1">Location Label</p>
            <p className="text-sm font-bold text-brand-navy">{equipment.location}</p>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-widest font-bold text-brand-navy/40 mb-1">Last Service</p>
            <p className="text-sm font-bold text-brand-navy">{history[0].date}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* History Column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-sm border border-brand-navy/5 shadow-sm">
            <h3 className="text-xl font-serif text-brand-navy mb-8">Service History Timeline</h3>
            <div className="space-y-8 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-px before:bg-brand-navy/5">
              {history.map((item, i) => (
                <Link key={i} to={`/portal/bookings/${item.id}`} className="flex gap-8 group relative z-10">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-all group-hover:scale-110 ${
                    item.status === 'Completed' ? 'bg-green-500 text-white' : 'bg-brand-gold text-brand-navy'
                  }`}>
                    {item.status === 'Completed' ? <CheckCircle2 size={18} /> : <Clock size={18} />}
                  </div>
                  <div className="flex-grow bg-brand-navy/5 p-6 rounded-sm group-hover:bg-brand-navy group-hover:text-white transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-sm font-bold">{item.type}</h4>
                      <span className="text-[8px] uppercase tracking-widest font-bold opacity-40">{item.date}</span>
                    </div>
                    <p className="text-xs opacity-60 mb-4">Technician: {item.technician} • {item.id}</p>
                    <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold text-brand-gold">
                      View Full Report <ArrowRight size={12} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Warranty Column */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-sm border border-brand-navy/5 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <ShieldCheck className="text-brand-gold" size={24} />
              <h3 className="text-lg font-serif text-brand-navy">Warranty Status</h3>
            </div>
            <div className="space-y-6">
              {warranties.map((w, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-bold text-brand-navy">{w.part}</p>
                    <span className="text-[8px] uppercase tracking-widest font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{w.status}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-brand-navy/40">
                    <span>{w.period} Period</span>
                    <span>Expires {w.expiry}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-8 border-t border-brand-navy/5">
              <button className="w-full flex items-center justify-center gap-3 text-[10px] uppercase tracking-widest font-bold text-brand-navy/40 hover:text-brand-navy transition-colors">
                <Download size={16} /> Download Warranty Card
              </button>
            </div>
          </div>

          <div className="bg-brand-navy p-8 rounded-sm text-white">
            <h4 className="text-sm font-bold mb-4">System Health</h4>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full border-4 border-brand-gold flex items-center justify-center text-brand-gold font-serif">A+</div>
              <p className="text-xs text-white/40 leading-relaxed">Your system is operating at peak efficiency based on the last diagnostic.</p>
            </div>
            <Link to="/book" className="text-[9px] uppercase tracking-widest font-bold text-brand-gold hover:text-white transition-colors flex items-center gap-2">
              Schedule Health Check <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
