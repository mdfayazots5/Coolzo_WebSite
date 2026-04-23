import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ChevronLeft, 
  Check, 
  Search, 
  Plus, 
  Minus, 
  MapPin, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Tag, 
  ShieldCheck, 
  ArrowRight,
  AlertCircle,
  Smartphone,
  Info,
  Loader2
} from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { BookingService, BookingRequest } from "../services/bookingService";
import { PaymentService } from "../services/paymentService";
import { useAuth } from "../contexts/AuthContext";
import { CatalogService, ACService } from "../services/catalogService";

// --- Types ---
type ServiceCategory = "Repair" | "Cleaning" | "Installation" | "Gas Refill" | "AMC";

interface BookingData {
  category: ServiceCategory | null;
  subType: string | null;
  brand: string;
  type: string;
  capacity: string;
  units: number;
  serviceId?: string;
  price?: number;
  address: {
    line1: string;
    line2: string;
    city: string;
    pinCode: string;
    label: "Home" | "Office" | "Other";
  };
  appointment: {
    date: string;
    slot: string;
    isEmergency: boolean;
  };
  contact: {
    fullName: string;
    mobile: string;
    email: string;
    instructions: string;
  };
  coupon: string;
}

const initialBookingData: BookingData = {
  category: null,
  subType: null,
  brand: "",
  type: "Split",
  capacity: "1.5 Ton",
  units: 1,
  address: {
    line1: "",
    line2: "",
    city: "",
    pinCode: "",
    label: "Home",
  },
  appointment: {
    date: "",
    slot: "",
    isEmergency: false,
  },
  contact: {
    fullName: "",
    mobile: "",
    email: "",
    instructions: "",
  },
  coupon: "",
};

// --- Mock Data ---
const categories = [
  { id: "Repair", label: "Precision Repair", icon: "🛠️", subTypes: ["Cooling Issue", "Water Leakage", "Noise Issue", "Electrical Fault", "Not Powering On"] },
  { id: "Cleaning", label: "Deep Jet Wash", icon: "🧼", subTypes: ["Deep Cleaning", "Filter Service", "Outdoor Unit Wash", "Anti-Bacterial Treatment"] },
  { id: "Installation", label: "Smart Install", icon: "🏗️", subTypes: ["New Installation", "Uninstallation", "Re-installation", "Site Survey"] },
  { id: "Gas Refill", label: "Gas Refilling", icon: "❄️", subTypes: ["R32 Gas", "R410A Gas", "R22 Gas", "Leakage Repair & Refill"] },
  { id: "AMC", label: "Total Care AMC", icon: "🛡️", subTypes: ["Basic Plan", "Professional Plan", "Comprehensive Plan"] },
];

const brands = ["Samsung", "LG", "Daikin", "Voltas", "Carrier", "Blue Star", "Mitsubishi", "Panasonic", "Hitachi", "Other"];
const acTypes = ["Split", "Window", "Cassette", "Centralized"];
const capacities = ["1 Ton", "1.5 Ton", "2 Ton", "3 Ton+"];

const timeSlots = [
  { id: "morning", label: "Morning", window: "8 AM – 12 PM" },
  { id: "afternoon", label: "Afternoon", window: "12 PM – 4 PM" },
  { id: "evening", label: "Evening", window: "4 PM – 7 PM" },
];

// --- Components ---

export default function BookingWizard() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<BookingData>(initialBookingData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    // Pre-fill data if passed from Service Details
    const state = location.state as { serviceId?: string, serviceName?: string, price?: number };
    if (state?.serviceId) {
      setData(prev => ({
        ...prev,
        serviceId: state.serviceId,
        category: "Repair", // Default if not specific
        subType: state.serviceName || null,
        price: state.price
      }));
      setStep(2); // Skip Step 1 if service is selected
    }

    if (user) {
      setData(prev => ({
        ...prev,
        contact: {
          ...prev.contact,
          fullName: user.displayName || "",
          email: user.email || ""
        }
      }));
    }
  }, [location.state, user]);

  const nextStep = () => setStep(s => Math.min(s + 1, 7));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleConfirm = async () => {
    if (!user) {
      navigate("/login", { state: { from: "/book" } });
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Create Booking
      const bookingRequest: BookingRequest = {
        userId: user.uid,
        serviceId: data.serviceId || "manual-entry",
        serviceName: data.subType || "AC Service",
        date: data.appointment.date,
        timeSlot: data.appointment.slot,
        address: `${data.address.line1}, ${data.address.line2 ? data.address.line2 + ', ' : ''}${data.address.city} - ${data.address.pinCode}`,
        status: 'scheduled',
        isEmergency: data.appointment.isEmergency,
        price: data.price || 499, // default if not set
        contactMobile: data.contact.mobile
      };

      const result = await BookingService.createBooking(bookingRequest);
      
      // 2. Initiate Payment (Simulated)
      await PaymentService.initiatePayment(result.id, data.price || 499);
      
      // 3. Navigate to Confirmation
      navigate("/booking-confirmation", { state: { bookingId: result.id, bookingData: data, ref: result.id } });
    } catch (err) {
      console.error("Booking or Payment failed:", err);
      alert("Failed to secure booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1: return !!data.category && !!data.subType;
      case 2: return !!data.brand && !!data.type && !!data.capacity;
      case 3: return !!data.address.line1 && !!data.address.pinCode && data.address.pinCode.length === 6;
      case 4: return !!data.appointment.date && !!data.appointment.slot;
      case 5: return !!data.contact.fullName && !!data.contact.mobile && !!data.contact.email;
      default: return true;
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream pt-24 pb-12">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header & Progress */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={() => step === 1 ? navigate("/") : prevStep()}
              className="flex items-center gap-2 text-brand-navy/40 hover:text-brand-navy text-[10px] uppercase tracking-widest font-bold transition-colors"
            >
              <ChevronLeft size={14} />
              {step === 1 ? "Back to Home" : "Previous Step"}
            </button>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-gold mb-1">Step {step} of 7</p>
              <p className="text-sm font-serif text-brand-navy">
                {step === 1 && "Service Selection"}
                {step === 2 && "Equipment Details"}
                {step === 3 && "Service Location"}
                {step === 4 && "Date & Time Slot"}
                {step === 5 && "Contact Information"}
                {step === 6 && "Booking Review"}
                {step === 7 && "Secure Payment"}
              </p>
            </div>
          </div>
          
          <div className="h-1 bg-brand-navy/5 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-brand-gold"
              initial={{ width: "0%" }}
              animate={{ width: `${(step / 7) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Wizard Content */}
        <div className="bg-white p-6 sm:p-8 md:p-12 rounded-sm border border-brand-navy/5 shadow-xl min-h-[500px] flex flex-col">
          <div className="flex-grow">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <Step1 
                  selectedCategory={data.category} 
                  selectedSubType={data.subType}
                  onSelect={(cat, sub) => setData({ ...data, category: cat, subType: sub })} 
                />
              )}
              {step === 2 && (
                <Step2 
                  data={data}
                  onChange={(updates) => setData({ ...data, ...updates })}
                />
              )}
              {step === 3 && (
                <Step3 
                  address={data.address}
                  onChange={(addr) => setData({ ...data, address: addr })}
                />
              )}
              {step === 4 && (
                <Step4 
                  appointment={data.appointment}
                  onChange={(app) => setData({ ...data, appointment: app })}
                />
              )}
              {step === 5 && (
                <Step5 
                  contact={data.contact}
                  coupon={data.coupon}
                  onChange={(updates) => setData({ ...data, ...updates })}
                />
              )}
              {step === 6 && (
                <Step6 
                  data={data}
                  onEdit={(s) => setStep(s)}
                />
              )}
              {step === 7 && (
                <Step7 
                  data={data}
                  isSubmitting={isSubmitting}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Footer Actions */}
          <div className="mt-12 pt-8 border-t border-brand-navy/5 flex justify-end">
            {step < 7 ? (
              <button
                disabled={!isStepValid()}
                onClick={nextStep}
                className={`px-12 py-4 rounded-sm text-[10px] uppercase tracking-[0.2em] font-bold transition-all flex items-center gap-3 ${
                  isStepValid() 
                    ? "bg-brand-navy text-white hover:bg-brand-gold hover:text-brand-navy shadow-lg" 
                    : "bg-brand-navy/10 text-brand-navy/30 cursor-not-allowed"
                }`}
              >
                Continue <ArrowRight size={14} />
              </button>
            ) : (
              <button
                disabled={isSubmitting}
                onClick={handleConfirm}
                className="w-full md:w-auto px-16 py-5 bg-brand-gold text-brand-navy rounded-sm text-xs uppercase tracking-[0.2em] font-bold hover:bg-brand-navy hover:text-white transition-all shadow-xl flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-brand-navy border-t-transparent rounded-full animate-spin" />
                    Securing your booking...
                  </>
                ) : (
                  <>Confirm & Book <ShieldCheck size={18} /></>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Step 1: Service Selection ---
function Step1({ selectedCategory, selectedSubType, onSelect }: { 
  selectedCategory: ServiceCategory | null, 
  selectedSubType: string | null,
  onSelect: (cat: ServiceCategory, sub: string) => void,
  key?: string
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h2 className="text-2xl sm:text-3xl font-serif text-brand-navy mb-8">What can we help you with?</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {categories.map((cat) => (
          <div key={cat.id} className="relative">
            <button
              onClick={() => onSelect(cat.id as ServiceCategory, cat.subTypes[0])}
              className={`w-full p-6 sm:p-8 rounded-sm border transition-all duration-500 text-left group ${
                selectedCategory === cat.id 
                  ? "border-brand-gold bg-brand-navy text-white shadow-xl" 
                  : "border-brand-navy/5 bg-white hover:border-brand-gold/50"
              }`}
            >
              <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-500">{cat.icon}</div>
              <p className={`text-[10px] uppercase tracking-widest font-bold mb-2 ${selectedCategory === cat.id ? "text-brand-gold" : "text-brand-navy/40"}`}>
                Category
              </p>
              <h3 className="text-xl font-serif">{cat.label}</h3>
              {selectedCategory === cat.id && (
                <div className="absolute top-4 right-4 text-brand-gold">
                  <Check size={20} />
                </div>
              )}
            </button>

            <AnimatePresence>
              {selectedCategory === cat.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mt-4 space-y-2"
                >
                  <p className="text-[9px] uppercase tracking-widest font-bold text-brand-navy/40 mb-3">Select Specific Issue</p>
                  <div className="flex flex-wrap gap-2">
                    {cat.subTypes.map(sub => (
                      <button
                        key={sub}
                        onClick={() => onSelect(cat.id as ServiceCategory, sub)}
                        className={`px-4 py-2 rounded-sm text-[10px] uppercase tracking-widest font-bold border transition-all ${
                          selectedSubType === sub 
                            ? "bg-brand-gold text-brand-navy border-brand-gold" 
                            : "bg-white text-brand-navy/60 border-brand-navy/10 hover:border-brand-gold"
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// --- Step 2: Equipment Details ---
function Step2({ data, onChange }: { data: BookingData, onChange: (u: Partial<BookingData>) => void, key?: string }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showBrands, setShowBrands] = useState(false);

  const filteredBrands = brands.filter(b => b.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-12"
    >
      <h2 className="text-2xl sm:text-3xl font-serif text-brand-navy mb-8">Tell us about your equipment.</h2>
      
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Brand Selection */}
        <div className="space-y-4 relative">
          <label className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">AC Brand</label>
          <div className="relative">
            <div 
              onClick={() => setShowBrands(!showBrands)}
              className="w-full bg-brand-cream/30 border border-brand-navy/5 rounded-sm px-6 py-4 text-brand-navy text-sm flex justify-between items-center cursor-pointer hover:border-brand-gold transition-colors"
            >
              {data.brand || "Select Brand"}
              <Search size={16} className="text-brand-navy/30" />
            </div>
            
            <AnimatePresence>
              {showBrands && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute z-20 top-full left-0 w-full mt-2 bg-white border border-brand-navy/5 shadow-2xl rounded-sm max-h-60 overflow-y-auto"
                >
                  <div className="p-4 border-b border-brand-navy/5">
                    <input 
                      autoFocus
                      type="text" 
                      placeholder="Search brands..."
                      className="w-full text-sm outline-none"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  {filteredBrands.map(brand => (
                    <button
                      key={brand}
                      onClick={() => {
                        onChange({ brand });
                        setShowBrands(false);
                      }}
                      className="w-full text-left px-6 py-3 text-sm hover:bg-brand-navy hover:text-white transition-colors"
                    >
                      {brand}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* AC Type */}
        <div className="space-y-4">
          <label className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">AC Type</label>
          <div className="grid grid-cols-2 gap-3">
            {acTypes.map(type => (
              <button
                key={type}
                onClick={() => onChange({ type })}
                className={`px-6 py-3 rounded-sm text-[10px] uppercase tracking-widest font-bold border transition-all ${
                  data.type === type 
                    ? "bg-brand-navy text-white border-brand-navy" 
                    : "bg-white text-brand-navy/40 border-brand-navy/10 hover:border-brand-gold"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Capacity */}
        <div className="space-y-4">
          <label className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">Capacity</label>
          <div className="flex flex-wrap gap-3">
            {capacities.map(cap => (
              <button
                key={cap}
                onClick={() => onChange({ capacity: cap })}
                className={`px-6 py-3 rounded-sm text-[10px] uppercase tracking-widest font-bold border transition-all ${
                  data.capacity === cap 
                    ? "bg-brand-gold text-brand-navy border-brand-gold" 
                    : "bg-white text-brand-navy/40 border-brand-navy/10 hover:border-brand-gold"
                }`}
              >
                {cap}
              </button>
            ))}
          </div>
        </div>

        {/* Units Stepper */}
        <div className="space-y-4">
          <label className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">Number of Units</label>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => onChange({ units: Math.max(1, data.units - 1) })}
              className="w-12 h-12 rounded-full border border-brand-navy/10 flex items-center justify-center text-brand-navy hover:bg-brand-navy hover:text-white transition-all"
            >
              <Minus size={18} />
            </button>
            <span className="text-3xl font-serif text-brand-navy w-8 text-center">{data.units}</span>
            <button 
              onClick={() => onChange({ units: data.units + 1 })}
              className="w-12 h-12 rounded-full border border-brand-navy/10 flex items-center justify-center text-brand-navy hover:bg-brand-navy hover:text-white transition-all"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// --- Step 3: Service Location ---
function Step3({ address, onChange }: { address: BookingData['address'], onChange: (a: BookingData['address']) => void, key?: string }) {
  const [isValidating, setIsValidating] = useState(false);
  const [pinStatus, setPinStatus] = useState<"valid" | "invalid" | null>(null);

  useEffect(() => {
    if (address.pinCode.length === 6) {
      setIsValidating(true);
      setTimeout(() => {
        setIsValidating(false);
        setPinStatus(address.pinCode.startsWith("50") ? "valid" : "invalid");
        if (address.pinCode.startsWith("50")) {
          onChange({ ...address, city: "Hyderabad" });
        }
      }, 1000);
    } else {
      setPinStatus(null);
    }
  }, [address.pinCode]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-12"
    >
      <h2 className="text-2xl sm:text-3xl font-serif text-brand-navy mb-8">Where should we arrive?</h2>
      
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">PIN / Postal Code</label>
            <div className="relative">
              <input 
                type="text" 
                maxLength={6}
                placeholder="e.g. 110001"
                className={`w-full bg-brand-cream/30 border rounded-sm px-6 py-4 text-brand-navy text-sm focus:outline-none transition-colors ${
                  pinStatus === 'invalid' ? 'border-red-300' : pinStatus === 'valid' ? 'border-green-300' : 'border-brand-navy/5 focus:border-brand-gold'
                }`}
                value={address.pinCode}
                onChange={(e) => onChange({ ...address, pinCode: e.target.value.replace(/\D/g, '') })}
              />
              {isValidating && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            {pinStatus === 'invalid' && (
              <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest flex items-center gap-2">
                <AlertCircle size={12} /> Service unavailable in this zone
              </p>
            )}
            {pinStatus === 'valid' && (
              <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest flex items-center gap-2">
                <Check size={12} /> We serve this location
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">Address Line 1</label>
            <input 
              type="text" 
              placeholder="House No, Building, Street"
              className="w-full bg-brand-cream/30 border border-brand-navy/5 rounded-sm px-6 py-4 text-brand-navy text-sm focus:outline-none focus:border-brand-gold transition-colors"
              value={address.line1}
              onChange={(e) => onChange({ ...address, line1: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">Apartment / Floor / Unit (Optional)</label>
            <input 
              type="text" 
              placeholder="e.g. Apt 4B, 2nd Floor"
              className="w-full bg-brand-cream/30 border border-brand-navy/5 rounded-sm px-6 py-4 text-brand-navy text-sm focus:outline-none focus:border-brand-gold transition-colors"
              value={address.line2}
              onChange={(e) => onChange({ ...address, line2: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">City</label>
              <input 
                disabled
                type="text" 
                className="w-full bg-brand-navy/5 border border-brand-navy/5 rounded-sm px-6 py-4 text-brand-navy/50 text-sm cursor-not-allowed"
                value={address.city}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">Label</label>
              <div className="flex gap-2">
                {["Home", "Office", "Other"].map(label => (
                  <button
                    key={label}
                    onClick={() => onChange({ ...address, label: label as any })}
                    className={`flex-grow py-4 rounded-sm text-[9px] uppercase tracking-widest font-bold border transition-all ${
                      address.label === label 
                        ? "bg-brand-navy text-white border-brand-navy" 
                        : "bg-white text-brand-navy/40 border-brand-navy/10 hover:border-brand-gold"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="bg-brand-navy/5 rounded-sm overflow-hidden relative min-h-[200px] sm:min-h-[300px] flex items-center justify-center border border-brand-navy/5">
          <div className="absolute inset-0 opacity-20 grayscale">
            <img 
              src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=2066&auto=format&fit=crop" 
              alt="Map Placeholder" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="relative z-10 text-center p-8">
            <MapPin size={48} className="text-brand-gold mx-auto mb-4 animate-bounce" />
            <p className="text-brand-navy font-serif text-xl mb-2">Location Detection</p>
            <p className="text-brand-navy/40 text-[10px] uppercase tracking-widest font-bold">Pin will adjust as you type address</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// --- Step 4: Date & Time Slot ---
function Step4({ appointment, onChange }: { appointment: BookingData['appointment'], onChange: (a: BookingData['appointment']) => void, key?: string }) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      full: date.toISOString().split('T')[0],
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' })
    };
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-12"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-8">
        <h2 className="text-2xl sm:text-3xl font-serif text-brand-navy">Select your window.</h2>
        <div className="flex items-center gap-4 bg-brand-gold/10 px-6 py-3 rounded-sm border border-brand-gold/20">
          <label className="text-[10px] uppercase tracking-widest font-bold text-brand-navy cursor-pointer">Emergency Service?</label>
          <button 
            onClick={() => onChange({ ...appointment, isEmergency: !appointment.isEmergency })}
            className={`w-12 h-6 rounded-full relative transition-colors ${appointment.isEmergency ? 'bg-brand-gold' : 'bg-brand-navy/20'}`}
          >
            <motion.div 
              className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"
              animate={{ x: appointment.isEmergency ? 24 : 0 }}
            />
          </button>
        </div>
      </div>

      {appointment.isEmergency && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="p-6 bg-red-50 border border-red-100 rounded-sm mb-8"
        >
          <div className="flex gap-4">
            <AlertCircle className="text-red-500 shrink-0" size={20} />
            <div>
              <p className="text-sm font-bold text-red-700 mb-1">Priority Dispatch Protocol</p>
              <p className="text-xs text-red-600 leading-relaxed">
                Emergency services incur a fixed surcharge of ₹499. A technician will be dispatched within 60 minutes of confirmation.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Calendar Strip */}
      <div className="space-y-4">
        <label className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">Select Date</label>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {days.map((day) => (
            <button
              key={day.full}
              onClick={() => onChange({ ...appointment, date: day.full })}
              className={`flex flex-col items-center min-w-[100px] p-6 rounded-sm border transition-all ${
                appointment.date === day.full 
                  ? "bg-brand-navy text-white border-brand-navy shadow-xl scale-105" 
                  : "bg-white text-brand-navy/40 border-brand-navy/10 hover:border-brand-gold"
              }`}
            >
              <span className="text-[10px] uppercase tracking-widest font-bold mb-2">{day.day}</span>
              <span className="text-3xl font-serif mb-1">{day.date}</span>
              <span className="text-[10px] uppercase tracking-widest font-bold opacity-60">{day.month}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Time Slots */}
      <AnimatePresence>
        {appointment.date && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <label className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">Available Time Slots</label>
            <div className="grid sm:grid-cols-3 gap-4">
              {timeSlots.map(slot => (
                <button
                  key={slot.id}
                  onClick={() => onChange({ ...appointment, slot: slot.id })}
                  className={`p-6 rounded-sm border text-left transition-all ${
                    appointment.slot === slot.id 
                      ? "bg-brand-gold text-brand-navy border-brand-gold shadow-lg" 
                      : "bg-white text-brand-navy/40 border-brand-navy/10 hover:border-brand-gold"
                  }`}
                >
                  <p className="text-[10px] uppercase tracking-widest font-bold mb-1">{slot.label}</p>
                  <p className="text-sm font-serif">{slot.window}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// --- Step 5: Contact Information ---
function Step5({ contact, coupon, onChange }: { contact: BookingData['contact'], coupon: string, onChange: (u: Partial<BookingData>) => void, key?: string }) {
  const [isApplying, setIsApplying] = useState(false);
  const [couponStatus, setCouponStatus] = useState<"success" | "error" | null>(null);

  const applyCoupon = () => {
    if (!coupon) return;
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      setCouponStatus(coupon.toUpperCase() === "COOLZO10" ? "success" : "error");
    }, 1000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-12"
    >
      <h2 className="text-3xl font-serif text-brand-navy mb-8">Who should we contact?</h2>
      
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-navy/30" />
              <input 
                type="text" 
                placeholder="Enter your name"
                className="w-full bg-brand-cream/30 border border-brand-navy/5 rounded-sm pl-14 pr-6 py-4 text-brand-navy text-sm focus:outline-none focus:border-brand-gold transition-colors"
                value={contact.fullName}
                onChange={(e) => onChange({ contact: { ...contact, fullName: e.target.value } })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">Mobile Number</label>
            <div className="relative">
              <Phone size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-navy/30" />
              <input 
                type="tel" 
                placeholder="+91 98765 43210"
                className="w-full bg-brand-cream/30 border border-brand-navy/5 rounded-sm pl-14 pr-6 py-4 text-brand-navy text-sm focus:outline-none focus:border-brand-gold transition-colors"
                value={contact.mobile}
                onChange={(e) => onChange({ contact: { ...contact, mobile: e.target.value } })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-navy/30" />
              <input 
                type="email" 
                placeholder="email@example.com"
                className="w-full bg-brand-cream/30 border border-brand-navy/5 rounded-sm pl-14 pr-6 py-4 text-brand-navy text-sm focus:outline-none focus:border-brand-gold transition-colors"
                value={contact.email}
                onChange={(e) => onChange({ contact: { ...contact, email: e.target.value } })}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">Special Instructions</label>
            <textarea 
              rows={4}
              placeholder="Building access codes, preferred unit location, etc."
              className="w-full bg-brand-cream/30 border border-brand-navy/5 rounded-sm px-6 py-4 text-brand-navy text-sm focus:outline-none focus:border-brand-gold transition-colors resize-none"
              value={contact.instructions}
              onChange={(e) => onChange({ contact: { ...contact, instructions: e.target.value } })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">Coupon Code</label>
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <Tag size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-navy/30" />
                <input 
                  type="text" 
                  placeholder="Enter code"
                  className={`w-full bg-brand-cream/30 border rounded-sm pl-14 pr-6 py-4 text-brand-navy text-sm focus:outline-none transition-colors ${
                    couponStatus === 'success' ? 'border-green-300' : couponStatus === 'error' ? 'border-red-300' : 'border-brand-navy/5 focus:border-brand-gold'
                  }`}
                  value={coupon}
                  onChange={(e) => {
                    onChange({ coupon: e.target.value });
                    setCouponStatus(null);
                  }}
                />
              </div>
              <button 
                onClick={applyCoupon}
                disabled={!coupon || isApplying}
                className="px-8 bg-brand-navy text-white rounded-sm text-[10px] uppercase tracking-widest font-bold hover:bg-brand-gold hover:text-brand-navy transition-all disabled:opacity-50"
              >
                {isApplying ? "..." : "Apply"}
              </button>
            </div>
            {couponStatus === 'success' && <p className="text-[9px] text-green-600 font-bold uppercase tracking-widest">Code applied: 10% discount secured</p>}
            {couponStatus === 'error' && <p className="text-[9px] text-red-500 font-bold uppercase tracking-widest">Invalid or expired code</p>}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// --- Step 6: Review Booking ---
function Step6({ data, onEdit }: { data: BookingData, onEdit: (s: number) => void, key?: string }) {
  const basePrice = 1200; // Mock base price
  const discount = data.coupon.toUpperCase() === "COOLZO10" ? basePrice * 0.1 : 0;
  const emergencySurcharge = data.appointment.isEmergency ? 499 : 0;
  const total = (basePrice * data.units) - discount + emergencySurcharge;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h2 className="text-3xl font-serif text-brand-navy mb-12">Review your curation.</h2>
      
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          {/* Service Summary */}
          <div className="bg-brand-navy/5 p-8 rounded-sm relative group">
            <button onClick={() => onEdit(1)} className="absolute top-8 right-8 text-[9px] uppercase tracking-widest font-bold text-brand-gold opacity-0 group-hover:opacity-100 transition-opacity">Edit</button>
            <div className="flex gap-6">
              <div className="text-3xl">{categories.find(c => c.id === data.category)?.icon}</div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40 mb-1">Service Requested</p>
                <h3 className="text-2xl font-serif text-brand-navy">{data.category}: {data.subType}</h3>
                <p className="text-sm text-brand-navy/60 mt-2">{data.brand} {data.type} — {data.capacity} ({data.units} Unit{data.units > 1 ? 's' : ''})</p>
              </div>
            </div>
          </div>

          {/* Location & Time */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-brand-navy/5 p-8 rounded-sm relative group">
              <button onClick={() => onEdit(3)} className="absolute top-8 right-8 text-[9px] uppercase tracking-widest font-bold text-brand-gold opacity-0 group-hover:opacity-100 transition-opacity">Edit</button>
              <MapPin className="text-brand-gold mb-4" size={20} />
              <p className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40 mb-1">Service Address</p>
              <p className="text-sm font-serif text-brand-navy leading-relaxed">
                {data.address.line1}, {data.address.line2 && data.address.line2 + ","}<br />
                {data.address.city} — {data.address.pinCode}<br />
                <span className="text-[9px] uppercase tracking-widest font-bold text-brand-gold mt-2 block">{data.address.label}</span>
              </p>
            </div>
            <div className="bg-brand-navy/5 p-8 rounded-sm relative group">
              <button onClick={() => onEdit(4)} className="absolute top-8 right-8 text-[9px] uppercase tracking-widest font-bold text-brand-gold opacity-0 group-hover:opacity-100 transition-opacity">Edit</button>
              <Calendar className="text-brand-gold mb-4" size={20} />
              <p className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40 mb-1">Appointment</p>
              <p className="text-sm font-serif text-brand-navy">
                {new Date(data.appointment.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}<br />
                {timeSlots.find(s => s.id === data.appointment.slot)?.window}
                {data.appointment.isEmergency && <span className="text-[9px] uppercase tracking-widest font-bold text-red-500 mt-2 block">Priority Dispatch Active</span>}
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Sidebar */}
        <div className="bg-brand-navy p-10 rounded-sm text-white h-fit">
          <h3 className="text-xl font-serif mb-8 border-b border-white/10 pb-6">Price Summary</h3>
          <div className="space-y-4 mb-8">
            <div className="flex justify-between text-sm">
              <span className="text-white/40">Base Service ({data.units} Units)</span>
              <span>₹{basePrice * data.units}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-brand-gold">
                <span>Coupon Discount</span>
                <span>-₹{discount}</span>
              </div>
            )}
            {emergencySurcharge > 0 && (
              <div className="flex justify-between text-sm text-red-400">
                <span>Emergency Surcharge</span>
                <span>+₹{emergencySurcharge}</span>
              </div>
            )}
            <div className="pt-4 border-t border-white/10 flex justify-between items-end">
              <span className="text-[10px] uppercase tracking-widest font-bold text-white/40">Estimated Total</span>
              <span className="text-3xl font-serif text-brand-gold">₹{total}</span>
            </div>
          </div>
          <div className="flex gap-3 p-4 bg-white/5 rounded-sm">
            <Info size={16} className="text-brand-gold shrink-0" />
            <p className="text-[9px] text-white/40 leading-relaxed uppercase tracking-widest">
              Final price confirmed after on-site inspection.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// --- Step 7: Secure Payment ---
function Step7({ data, isSubmitting }: { data: BookingData, isSubmitting: boolean }) {
  const [method, setMethod] = useState<'upi' | 'card' | 'cod'>('upi');
  const basePrice = 1200;
  const discount = data.coupon.toUpperCase() === "COOLZO10" ? basePrice * 0.1 : 0;
  const emergencySurcharge = data.appointment.isEmergency ? 499 : 0;
  const total = (basePrice * data.units) - discount + emergencySurcharge;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h2 className="text-3xl font-serif text-brand-navy mb-12">Secure your session.</h2>
      
      <div className="grid lg:grid-cols-2 gap-20">
        <div className="space-y-8">
          <p className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">Select Payment Method</p>
          <div className="space-y-4">
            {[
              { id: 'upi', label: 'UPI / Google Pay', desc: 'Instant confirmation via any UPI app', icon: <Smartphone size={20} /> },
              { id: 'card', label: 'Credit / Debit Card', desc: 'Secure encryption for all major cards', icon: <ShieldCheck size={20} /> },
              { id: 'cod', label: 'Pay After Service', desc: 'Cash or QR payment upon completion', icon: <Clock size={20} /> },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setMethod(m.id as any)}
                className={`w-full p-6 text-left rounded-sm border transition-all flex items-center gap-6 group ${
                  method === m.id 
                    ? "bg-brand-navy text-white border-brand-navy shadow-xl" 
                    : "bg-white text-brand-navy/60 border-brand-navy/10 hover:border-brand-gold"
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${method === m.id ? 'bg-brand-gold text-brand-navy' : 'bg-brand-navy/5 text-brand-navy/40 group-hover:bg-brand-gold group-hover:text-brand-navy'}`}>
                  {m.icon}
                </div>
                <div className="flex-grow">
                  <h4 className="text-sm font-bold mb-1">{m.label}</h4>
                  <p className="text-[10px] uppercase tracking-widest text-brand-navy/40 group-hover:text-white/40 transition-colors">{m.desc}</p>
                </div>
                {method === m.id && <Check size={20} className="text-brand-gold" />}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-brand-navy/5 p-12 rounded-sm border border-brand-navy/5">
          <div className="text-center mb-10">
            <ShieldCheck size={48} className="text-brand-gold mx-auto mb-6" />
            <h3 className="text-2xl font-serif text-brand-navy mb-4">Total Integrity Secure</h3>
            <p className="text-brand-navy/50 text-sm leading-relaxed mx-auto max-w-xs">
              Your transaction is protected by industry-standard encryption protocols.
            </p>
          </div>

          <div className="space-y-4 pt-10 border-t border-brand-navy/10">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">Amount Payable</span>
              <span className="text-3xl font-serif text-brand-navy">₹{total}</span>
            </div>
            <label className="flex items-start gap-3 cursor-pointer group pt-4">
              <input type="checkbox" required className="mt-1 accent-brand-gold" />
              <span className="text-[10px] text-brand-navy/40 uppercase tracking-widest leading-relaxed group-hover:text-brand-navy transition-colors">
                I authorize Coolzo to securely process this transaction and agree to the <Link to="/terms" className="text-brand-gold underline">Refund Policy</Link>.
              </span>
            </label>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
