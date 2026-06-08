import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft,
  Check,
  Plus,
  Minus,
  MapPin,
  Calendar,
  Clock,
  User,
  Phone,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  Loader2,
  Star,
  Wrench,
  Wind,
  Zap,
  Droplets,
  HelpCircle,
  CheckCircle2,
  Tag,
  X,
  Flame,
  Building2,
  Home,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import apiClient from "../services/apiClient";
import { BookingService } from "../services/bookingService";
import { CatalogService } from "../services/catalogService";
import { EquipmentService } from "../services/equipmentService";
import { AddressService } from "../services/addressService";
import { ProfileService } from "../services/profileService";
import { MarketingService } from "../services/marketingService";
import { AuthService } from "../services/authService";
import { useAuth } from "../contexts/AuthContext";
import type {
  ServiceCategoryLookupResponse,
  ServiceLookupResponse,
  AcTypeLookupResponse,
  SlotAvailabilityResponse,
} from "../types/catalog";
import type { CustomerEquipmentResponse } from "../types/equipment";
import type { CustomerAddressResponse } from "../types/address";
import type { PromotionalOffer } from "../services/marketingService";
import type {
  CustomerBookingCreateRequest,
  GuestBookingCreateRequest,
} from "../types/booking";

// ─── Wizard State ─────────────────────────────────────────────────────────────

interface WizardData {
  // Step 1 — Service & AC Type
  serviceTypeId: number | null;      // category ID
  serviceTypeName: string;           // e.g. "AC Repair"
  serviceSubTypeId: number | null;   // service/sub-type ID
  serviceSubTypeName: string;
  acTypeId: number | null;
  acTypeName: string;
  unitCount: number;
  serviceBasePrice: number | null;
  otherNote: string;                 // free text when "Other" category selected
  // Journey B — registered equipment (Step 1)
  selectedEquipmentId: number | null;
  selectedEquipmentName: string;

  // Step 2 — Service Location
  pincode: string;
  zoneId: number | null;
  zoneName: string;
  addressLine1: string;
  addressLine2: string;
  cityName: string;
  // Journey B — saved address (Step 2)
  selectedAddressId: number | null;

  // Step 3 — Date & Time
  slotDate: string;
  slotAvailabilityId: number | null;
  slotWindow: "Morning" | "Afternoon" | "Evening" | "Emergency" | null;
  isEmergency: boolean;
  emergencySurcharge: number;

  // Step 4 — Contact Details
  guestName: string;
  guestMobile: string;
  mobileVerified: boolean;
  specialInstructions: string;
  couponCode: string;
  appliedCoupon: string;
  discountAmount: number;

  // Step 5 — Confirm
  termsAccepted: boolean;
}

const INITIAL_DATA: WizardData = {
  serviceTypeId: null, serviceTypeName: "", serviceSubTypeId: null, serviceSubTypeName: "",
  acTypeId: null, acTypeName: "", unitCount: 1, serviceBasePrice: null, otherNote: "",
  selectedEquipmentId: null, selectedEquipmentName: "",
  pincode: "", zoneId: null, zoneName: "", addressLine1: "", addressLine2: "", cityName: "",
  selectedAddressId: null,
  slotDate: "", slotAvailabilityId: null, slotWindow: null, isEmergency: false, emergencySurcharge: 0,
  guestName: "", guestMobile: "", mobileVerified: false, specialInstructions: "",
  couponCode: "", appliedCoupon: "", discountAmount: 0,
  termsAccepted: false,
};

// ─── Step labels ──────────────────────────────────────────────────────────────

const STEP_LABELS: Record<number, string> = {
  1: "Service & AC Type",
  2: "Service Location",
  3: "Date & Time",
  4: "Your Details",
  5: "Review & Confirm",
};
const TOTAL_STEPS = 5;

// ─── Category helpers ─────────────────────────────────────────────────────────

function getCategoryIcon(name: string): React.ReactNode {
  const n = name.toLowerCase();
  if (n.includes("repair"))                         return <Wrench size={22} />;
  if (n.includes("gas") || n.includes("refill"))    return <Droplets size={22} />;
  if (n.includes("clean") || n.includes("service")) return <Wind size={22} />;
  if (n.includes("install"))                        return <Zap size={22} />;
  if (n.includes("amc") || n.includes("mainten"))   return <ShieldCheck size={22} />;
  return <HelpCircle size={22} />;
}

function isAmc(name: string)   { return name.toLowerCase().includes("amc") || name.toLowerCase().includes("mainten"); }
function isOther(name: string) { return name.toLowerCase().includes("other"); }
function needsUnits(name: string) {
  const n = name.toLowerCase();
  return n.includes("clean") || n.includes("install") || n.includes("gas");
}

// ─── Mask mobile for display ──────────────────────────────────────────────────

function maskMobile(mobile: string): string {
  const m = mobile.replace(/\D/g, "");
  if (m.length < 10) return "••••••••••";
  return `${m.slice(0, 2)}XXX XX${m.slice(-3)}`;
}

// ─── Shared field styles ──────────────────────────────────────────────────────

const inputBase =
  "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-brand-navy placeholder:text-brand-navy/30 focus:outline-none focus:border-brand-gold focus:bg-white transition-all";
const labelBase =
  "block text-[11px] font-semibold text-brand-navy/50 uppercase tracking-wide mb-1.5";

// ─── Main Component ───────────────────────────────────────────────────────────

export default function BookingWizard() {
  const [step, setStep]                 = useState(1);
  const [data, setData]                 = useState<WizardData>(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError]   = useState("");
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user }  = useAuth();
  const isLoggedIn = !!user;

  // ── Catalog (both journeys) ─────────────────────────────────────────────────
  const [lookups, setLookups] = useState<{
    categories: ServiceCategoryLookupResponse[];
    servicesByCategory: Record<number, ServiceLookupResponse[]>;
    acTypes: AcTypeLookupResponse[];
  }>({ categories: [], servicesByCategory: {}, acTypes: [] });
  const [lookupsLoading, setLookupsLoading] = useState(true);

  // ── Journey B data ──────────────────────────────────────────────────────────
  const [myEquipment, setMyEquipment]     = useState<CustomerEquipmentResponse[]>([]);
  const [myAddresses, setMyAddresses]     = useState<CustomerAddressResponse[]>([]);
  const [myMobile, setMyMobile]           = useState("");
  const [loyaltyOffers, setLoyaltyOffers] = useState<PromotionalOffer[]>([]);

  useEffect(() => {
    // Load catalog (shared by both journeys)
    Promise.allSettled([
      CatalogService.getServiceCategories(),
      CatalogService.getServices(),
      CatalogService.getAcTypes(),
    ]).then(([catRes, svcRes, acRes]) => {
      const cats = catRes.status === "fulfilled" ? catRes.value ?? [] : [];
      const svcs = svcRes.status === "fulfilled" ? svcRes.value ?? [] : [];
      const acs  = acRes.status  === "fulfilled" ? acRes.value  ?? [] : [];
      const grouped = svcs.reduce<Record<number, ServiceLookupResponse[]>>((acc, s) => {
        if (!acc[s.serviceCategoryId]) acc[s.serviceCategoryId] = [];
        acc[s.serviceCategoryId].push(s);
        return acc;
      }, {});
      setLookups({ categories: cats, servicesByCategory: grouped, acTypes: acs });
    }).finally(() => setLookupsLoading(false));

    // Load Journey B data (logged-in only)
    if (isLoggedIn) {
      // Pre-fill name; mark mobile verified (identity already confirmed)
      setData((prev) => ({
        ...prev,
        guestName: user?.fullName || "",
        mobileVerified: true,
      }));

      // Registered equipment for B-S1
      EquipmentService.getMyEquipment()
        .then((eq) => setMyEquipment(eq.filter((e) => e.isActive)))
        .catch(() => setMyEquipment([]));

      // Saved addresses for B-S2
      AddressService.getMyAddresses()
        .then((addrs) => {
          const sorted = [...addrs].sort((a, b) =>
            a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1,
          );
          setMyAddresses(sorted);
        })
        .catch(() => setMyAddresses([]));

      // Mobile number for B-S4 masked display
      ProfileService.getMyProfile()
        .then((p) => setMyMobile(p.mobileNumber || ""))
        .catch(() => setMyMobile(""));

      // Loyalty / promo offers for B-S4 coupon chip
      MarketingService.getOffers()
        .then((offers) => setLoyaltyOffers(offers.filter((o) => !!o.couponCode)))
        .catch(() => setLoyaltyOffers([]));
    }

    // Deep-link pre-select
    const state = location.state as { serviceCategoryId?: number; serviceCategoryName?: string } | null;
    if (state?.serviceCategoryId) {
      setData((prev) => ({
        ...prev,
        serviceTypeId: state.serviceCategoryId!,
        serviceTypeName: state.serviceCategoryName ?? "",
      }));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const update   = (updates: Partial<WizardData>) => setData((prev) => ({ ...prev, ...updates }));
  const nextStep = () => { setStep((s) => Math.min(s + 1, TOTAL_STEPS)); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const prevStep = () => { setStep((s) => Math.max(s - 1, 1)); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const isStepValid = (): boolean => {
    switch (step) {
      case 1: {
        if (!data.serviceTypeId || !data.acTypeId) return false;
        const skipSubType = isAmc(data.serviceTypeName) || isOther(data.serviceTypeName);
        return skipSubType ? true : data.serviceSubTypeId !== null;
      }
      case 2: return data.pincode.length === 6 && data.zoneId !== null && data.addressLine1.trim().length >= 5;
      case 3: return !!data.slotDate && (data.slotAvailabilityId !== null || data.isEmergency);
      case 4: return isLoggedIn
        ? true
        : data.guestName.trim().length >= 2 && data.mobileVerified;
      case 5: return data.termsAccepted;
      default: return true;
    }
  };

  // ── Booking submit ──────────────────────────────────────────────────────────
  const handleConfirm = async () => {
    setIsSubmitting(true);
    setSubmitError("");
    try {
      const noteParts = [
        data.specialInstructions,
        data.otherNote ? `Service note: ${data.otherNote}` : "",
        data.selectedEquipmentName ? `Equipment: ${data.selectedEquipmentName}` : "",
      ].filter(Boolean);

      const basePayload: CustomerBookingCreateRequest = {
        serviceId: data.serviceSubTypeId ?? data.serviceTypeId!,
        acTypeId:  data.acTypeId ?? undefined,
        slotAvailabilityId: data.slotAvailabilityId!,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2 || undefined,
        cityName: data.cityName,
        pincode: data.pincode,
        issueNotes: noteParts.join(" | ") || undefined,
        isEmergency: data.isEmergency,
        sourceChannel: "web",
      };

      const result = isLoggedIn
        ? await BookingService.createCustomerBooking(basePayload)
        : await BookingService.createGuestBooking({
            ...basePayload,
            customerName: data.guestName,
            mobileNumber: data.guestMobile,
          } as GuestBookingCreateRequest);

      navigate("/booking-confirmation", {
        state: {
          booking: result,
          addressLine: data.addressLine1,
          cityName: data.cityName,
          pincode: data.pincode,
        },
      });
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-2xl">

        {/* Page header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-5">
            <button
              onClick={() => (step === 1 ? navigate("/") : prevStep())}
              className="flex items-center gap-1.5 text-xs font-semibold text-brand-navy/40 hover:text-brand-navy transition-colors"
            >
              <ChevronLeft size={14} />
              {step === 1 ? "Back to Home" : "Back"}
            </button>
            <div className="text-right">
              <p className="text-[11px] font-semibold text-brand-gold uppercase tracking-widest">
                Step {step} of {TOTAL_STEPS}
              </p>
              <p className="text-sm font-semibold text-brand-navy mt-0.5">{STEP_LABELS[step]}</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-brand-gold rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            />
          </div>
          <div className="flex justify-between mt-2 px-0.5">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((s) => (
              <div
                key={s}
                className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${s <= step ? "bg-brand-gold" : "bg-slate-300"}`}
              />
            ))}
          </div>
        </div>

        {/* Main card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8 min-h-[420px]">
            {lookupsLoading && step === 1 ? (
              <div className="flex flex-col items-center justify-center h-80 gap-4">
                <Loader2 className="animate-spin text-brand-gold" size={32} />
                <p className="text-xs font-semibold text-brand-navy/40 uppercase tracking-widest">
                  Loading services…
                </p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <Step1
                    key="step1"
                    data={data}
                    categories={lookups.categories}
                    servicesByCategory={lookups.servicesByCategory}
                    acTypes={lookups.acTypes}
                    isLoggedIn={isLoggedIn}
                    myEquipment={myEquipment}
                    onUpdate={update}
                  />
                )}
                {step === 2 && (
                  <Step2
                    key="step2"
                    data={data}
                    isLoggedIn={isLoggedIn}
                    myAddresses={myAddresses}
                    onUpdate={update}
                  />
                )}
                {step === 3 && (
                  <Step3 key="step3" data={data} onUpdate={update} />
                )}
                {step === 4 && (
                  <Step4
                    key="step4"
                    data={data}
                    isLoggedIn={isLoggedIn}
                    myMobile={myMobile}
                    loyaltyOffers={loyaltyOffers}
                    onUpdate={update}
                  />
                )}
                {step === 5 && (
                  <Step5
                    key="step5"
                    data={data}
                    isLoggedIn={isLoggedIn}
                    onUpdate={update}
                    onEdit={setStep}
                    isSubmitting={isSubmitting}
                    submitError={submitError}
                  />
                )}
              </AnimatePresence>
            )}
          </div>

          {/* Footer action bar */}
          <div className="px-6 sm:px-8 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-4">
            {step > 1 ? (
              <button
                onClick={prevStep}
                className="flex items-center gap-1.5 text-sm font-semibold text-brand-navy/40 hover:text-brand-navy transition-colors px-3 py-2 rounded-lg hover:bg-slate-100"
              >
                <ChevronLeft size={14} /> Back
              </button>
            ) : <span />}

            {step < TOTAL_STEPS ? (
              <button
                disabled={!isStepValid()}
                onClick={nextStep}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isStepValid()
                    ? "bg-brand-navy text-white hover:bg-brand-gold hover:text-brand-navy shadow-sm"
                    : "bg-slate-100 text-slate-300 cursor-not-allowed"
                }`}
              >
                Continue <ArrowRight size={15} />
              </button>
            ) : (
              <button
                disabled={!isStepValid() || isSubmitting}
                onClick={handleConfirm}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all shadow-sm ${
                  isStepValid() && !isSubmitting
                    ? "bg-brand-gold text-brand-navy hover:bg-brand-navy hover:text-white"
                    : "bg-slate-100 text-slate-300 cursor-not-allowed"
                }`}
              >
                {isSubmitting ? (
                  <><Loader2 size={15} className="animate-spin" /> Booking…</>
                ) : (
                  <><ShieldCheck size={15} /> Confirm & Book</>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Trust strip */}
        <div className="mt-5 flex items-center justify-center gap-6 flex-wrap">
          {[
            { icon: <ShieldCheck size={13} />, label: "Verified Technicians" },
            { icon: <Star size={13} />,        label: "4.9★ Rated Service" },
            { icon: <Clock size={13} />,        label: "On-Time Guarantee" },
          ].map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-1.5 text-brand-navy/40">
              <span className="text-brand-gold">{icon}</span>
              <span className="text-[11px] font-semibold">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Step 1: Service & AC Type ─────────────────────────────────────────────────
// Journey A: category cards → sub-type chips → AC type chips → units
// Journey B [B-S1]: + Registered Equipment Quick-Select at very top
// API (B-S1): GET /api/customers/me/equipment (loaded in parent, passed as prop)

interface Step1Props {
  data: WizardData;
  categories: ServiceCategoryLookupResponse[];
  servicesByCategory: Record<number, ServiceLookupResponse[]>;
  acTypes: AcTypeLookupResponse[];
  isLoggedIn: boolean;
  myEquipment: CustomerEquipmentResponse[];
  onUpdate: (updates: Partial<WizardData>) => void;
}

function Step1({ data, categories, servicesByCategory, acTypes, isLoggedIn, myEquipment, onUpdate }: Step1Props) {
  const subTypes      = data.serviceTypeId ? (servicesByCategory[data.serviceTypeId] ?? []) : [];
  const showSubTypeRow = data.serviceTypeId !== null && !isAmc(data.serviceTypeName) && !isOther(data.serviceTypeName);
  const showUnitsRow   = data.serviceTypeId !== null && needsUnits(data.serviceTypeName);

  const showEquipmentSection = isLoggedIn && myEquipment.length > 0;

  // ── Equipment card select / deselect ─────────────────────────────────────
  const handleEquipmentSelect = (eq: CustomerEquipmentResponse) => {
    // Auto-set AC type chip matching the equipment's type
    const matchingAcType = acTypes.find(
      (a) => a.acTypeName.toLowerCase() === eq.type.toLowerCase(),
    );
    onUpdate({
      selectedEquipmentId:   eq.equipmentId,
      selectedEquipmentName: eq.name || `${eq.brand} ${eq.type}`,
      acTypeId:   matchingAcType?.acTypeId   ?? data.acTypeId,
      acTypeName: matchingAcType?.acTypeName ?? data.acTypeName,
    });
  };

  const handleEquipmentDeselect = () => {
    onUpdate({ selectedEquipmentId: null, selectedEquipmentName: "" });
  };

  // ── Category / sub-type ───────────────────────────────────────────────────
  const handleCategorySelect = (cat: ServiceCategoryLookupResponse) => {
    onUpdate({
      serviceTypeId:      cat.serviceCategoryId,
      serviceTypeName:    cat.categoryName,
      serviceSubTypeId:   null,
      serviceSubTypeName: "",
      serviceBasePrice:   null,
      otherNote:          "",
    });
  };

  const handleSubTypeSelect = (svc: ServiceLookupResponse) => {
    onUpdate({
      serviceSubTypeId:   svc.serviceId,
      serviceSubTypeName: svc.serviceName,
      serviceBasePrice:   svc.basePrice ?? null,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-xl font-bold text-brand-navy">What do you need help with?</h2>
        <p className="text-sm text-brand-navy/40 mt-1">Select a service category to get started</p>
      </div>

      {/* ── [B-S1] Registered Equipment Quick-Select ──────────────────────── */}
      {showEquipmentSection && (
        <div>
          {/* Section divider */}
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[11px] font-bold text-brand-navy/40 uppercase tracking-wide whitespace-nowrap">
              Your equipment
            </span>
            <div className="h-px bg-slate-200 flex-1" />
          </div>

          <div className="flex gap-2.5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
            {/* Equipment cards */}
            {myEquipment.map((eq) => {
              const isSelected = data.selectedEquipmentId === eq.equipmentId;
              return (
                <button
                  key={eq.equipmentId}
                  onClick={() => isSelected ? handleEquipmentDeselect() : handleEquipmentSelect(eq)}
                  className={`shrink-0 w-40 text-left p-3 rounded-xl border-2 transition-all ${
                    isSelected
                      ? "border-brand-gold bg-brand-gold/5 shadow-sm"
                      : "border-slate-100 bg-white hover:border-brand-gold/40 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected ? "bg-brand-gold/20" : "bg-slate-100"
                    }`}>
                      <Wind size={14} className={isSelected ? "text-brand-gold" : "text-brand-navy/40"} />
                    </div>
                    {isSelected && (
                      <Check size={12} className="text-brand-gold ml-auto shrink-0" strokeWidth={3} />
                    )}
                  </div>
                  <p className="text-xs font-bold text-brand-navy leading-tight truncate">
                    {eq.brand}
                  </p>
                  <p className="text-[11px] text-brand-navy/50 mt-0.5 truncate">
                    {eq.type}{eq.capacity ? ` · ${eq.capacity}` : ""}
                  </p>
                  {eq.location && (
                    <p className="text-[10px] text-brand-navy/30 mt-0.5 truncate">{eq.location}</p>
                  )}
                </button>
              );
            })}

            {/* "New unit +" deselect card — always last */}
            <button
              onClick={handleEquipmentDeselect}
              className={`shrink-0 w-36 flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                data.selectedEquipmentId === null
                  ? "border-brand-gold bg-brand-gold/5 shadow-sm"
                  : "border-dashed border-slate-200 bg-white hover:border-brand-gold/40"
              }`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                data.selectedEquipmentId === null ? "bg-brand-gold/20" : "bg-slate-100"
              }`}>
                <Plus size={14} className={data.selectedEquipmentId === null ? "text-brand-gold" : "text-brand-navy/40"} />
              </div>
              <span className={`text-[11px] font-semibold text-center leading-tight ${
                data.selectedEquipmentId === null ? "text-brand-navy" : "text-brand-navy/40"
              }`}>
                New / different unit
              </span>
            </button>
          </div>

          {/* Separator before category cards */}
          <div className="h-px bg-slate-100 mt-4" />
        </div>
      )}

      {/* ── Service Category Cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3">
        {categories.map((cat) => {
          const isSelected  = data.serviceTypeId === cat.serviceCategoryId;
          const hasSelection = data.serviceTypeId !== null;
          return (
            <button
              key={cat.serviceCategoryId}
              onClick={() => handleCategorySelect(cat)}
              className={`relative flex flex-col items-center justify-center gap-2 px-2 py-4 rounded-xl border-2 text-center transition-all duration-200 ${
                isSelected
                  ? "border-brand-gold bg-brand-gold/5 shadow-sm"
                  : hasSelection
                  ? "border-slate-100 bg-white opacity-60 hover:opacity-100 hover:border-brand-gold/40"
                  : "border-slate-100 bg-white hover:border-brand-gold/40 hover:shadow-sm"
              }`}
            >
              {isSelected && (
                <span className="absolute top-2 right-2 w-5 h-5 bg-brand-gold rounded-full flex items-center justify-center">
                  <Check size={11} className="text-white" strokeWidth={3} />
                </span>
              )}
              <span className={isSelected ? "text-brand-gold" : "text-brand-navy/50"}>
                {getCategoryIcon(cat.categoryName)}
              </span>
              <span className={`text-xs font-semibold leading-tight ${isSelected ? "text-brand-navy" : "text-brand-navy/60"}`}>
                {cat.categoryName}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── "Other" free-text ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {data.serviceTypeId !== null && isOther(data.serviceTypeName) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <label className={labelBase}>Describe your service need</label>
            <textarea
              rows={2}
              maxLength={100}
              placeholder="Briefly describe what you need help with…"
              className={`${inputBase} resize-none`}
              value={data.otherNote}
              onChange={(e) => onUpdate({ otherNote: e.target.value })}
            />
            <p className="mt-1 text-right text-[11px] text-brand-navy/30">
              {data.otherNote.length} / 100
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Service Sub-Type Chips ─────────────────────────────────────────── */}
      <AnimatePresence>
        {showSubTypeRow && subTypes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-2">
              <label className={labelBase}>
                Select service type <span className="text-red-400">*</span>
              </label>
              <div className="flex flex-wrap gap-2 mt-1">
                {subTypes.map((svc) => {
                  const isChipSelected = data.serviceSubTypeId === svc.serviceId;
                  return (
                    <button
                      key={svc.serviceId}
                      onClick={() => handleSubTypeSelect(svc)}
                      className={`px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all ${
                        isChipSelected
                          ? "bg-brand-navy text-white border-brand-navy shadow-sm"
                          : "bg-white text-brand-navy border-brand-navy/30 hover:border-brand-navy"
                      }`}
                    >
                      {isChipSelected && <Check size={10} className="inline mr-1 -mt-0.5" strokeWidth={3} />}
                      {svc.serviceName}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── AC Type Chips (always visible) ────────────────────────────────── */}
      <div>
        <label className={labelBase}>
          AC Type <span className="text-red-400">*</span>
          {data.selectedEquipmentId && (
            <span className="ml-2 text-brand-gold normal-case tracking-normal font-normal">
              (auto-set from your equipment)
            </span>
          )}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {acTypes.map((ac) => {
            const isSelected = data.acTypeId === ac.acTypeId;
            return (
              <button
                key={ac.acTypeId}
                onClick={() => onUpdate({ acTypeId: ac.acTypeId, acTypeName: ac.acTypeName })}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  isSelected
                    ? "bg-brand-navy text-white border-brand-navy shadow-sm"
                    : "bg-white text-brand-navy border-brand-navy/20 hover:border-brand-navy"
                }`}
              >
                {isSelected && <Check size={10} className="inline mr-1 -mt-0.5" strokeWidth={3} />}
                {ac.acTypeName}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Number of Units (conditional) ─────────────────────────────────── */}
      <AnimatePresence>
        {showUnitsRow && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div>
              <label className={labelBase}>Number of Units</label>
              <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 w-fit">
                <button
                  onClick={() => onUpdate({ unitCount: Math.max(1, data.unitCount - 1) })}
                  className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-brand-navy hover:bg-brand-navy hover:text-white hover:border-brand-navy transition-all"
                >
                  <Minus size={14} />
                </button>
                <span className="text-lg font-bold text-brand-navy w-8 text-center tabular-nums">
                  {data.unitCount}
                </span>
                <button
                  onClick={() => onUpdate({ unitCount: Math.min(20, data.unitCount + 1) })}
                  className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-brand-navy hover:bg-brand-navy hover:text-white hover:border-brand-navy transition-all"
                >
                  <Plus size={14} />
                </button>
              </div>
              <p className="mt-1.5 text-[11px] text-brand-navy/30">Min 1 · Max 20</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Step 2: Service Location ──────────────────────────────────────────────────
// Journey A: PIN → zone validation → address fields revealed on serviceable PIN
// Journey B [B-S2]: + Saved Address Quick-Select at very top
// API (B-S2): GET /api/customers/me/addresses (loaded in parent, passed as prop)

interface Step2Props {
  data: WizardData;
  isLoggedIn: boolean;
  myAddresses: CustomerAddressResponse[];
  onUpdate: (updates: Partial<WizardData>) => void;
}

function Step2({ data, isLoggedIn, myAddresses, onUpdate }: Step2Props) {
  const [pinStatus, setPinStatus]       = useState<"valid" | "invalid" | null>(
    data.zoneId ? "valid" : null,
  );
  const [isValidating, setIsValidating] = useState(false);
  // B-S2: show manual form (true = visible, false = collapsed when saved address selected)
  const [showManualForm, setShowManualForm] = useState(!data.selectedAddressId);

  const showAddressCards = isLoggedIn && myAddresses.length > 0;
  const isServiceable    = pinStatus === "valid" && data.zoneId !== null;

  // ── PIN validation (manual entry) ────────────────────────────────────────
  useEffect(() => {
    if (!showManualForm) return;           // skip while saved address is selected
    if (data.pincode.length !== 6) { setPinStatus(null); return; }
    setIsValidating(true);
    CatalogService.getZoneByPincode(data.pincode)
      .then((zone) => {
        if (zone.isServiceable) {
          onUpdate({ zoneId: zone.zoneId, zoneName: zone.zoneName });
          setPinStatus("valid");
        } else {
          onUpdate({ zoneId: null, zoneName: "" });
          setPinStatus("invalid");
        }
      })
      .catch(() => { onUpdate({ zoneId: null, zoneName: "" }); setPinStatus("invalid"); })
      .finally(() => setIsValidating(false));
  }, [data.pincode, showManualForm]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Select a saved address ────────────────────────────────────────────────
  const handleAddressSelect = (addr: CustomerAddressResponse) => {
    // If the saved address already has zone data (validated when saved), use it directly
    if (addr.zoneId && addr.zoneName) {
      onUpdate({
        selectedAddressId: addr.addressId,
        pincode:      addr.pincode,
        zoneId:       addr.zoneId,
        zoneName:     addr.zoneName,
        addressLine1: addr.addressLine1,
        addressLine2: addr.addressLine2 ?? "",
        cityName:     addr.cityName,
      });
      setPinStatus("valid");
    } else {
      // Fallback: run zone validation via API
      onUpdate({
        selectedAddressId: addr.addressId,
        pincode:      addr.pincode,
        addressLine1: addr.addressLine1,
        addressLine2: addr.addressLine2 ?? "",
        cityName:     addr.cityName,
        zoneId: null,
        zoneName: "",
      });
      setPinStatus(null);
      setIsValidating(true);
      CatalogService.getZoneByPincode(addr.pincode)
        .then((zone) => {
          if (zone.isServiceable) {
            onUpdate({ zoneId: zone.zoneId, zoneName: zone.zoneName });
            setPinStatus("valid");
          } else {
            setPinStatus("invalid");
          }
        })
        .catch(() => setPinStatus("invalid"))
        .finally(() => setIsValidating(false));
    }
    setShowManualForm(false);
  };

  const handleEnterDifferentAddress = () => {
    onUpdate({
      selectedAddressId: null,
      pincode: "", zoneId: null, zoneName: "",
      addressLine1: "", addressLine2: "", cityName: "",
    });
    setPinStatus(null);
    setShowManualForm(true);
  };

  // ── Address label icon ────────────────────────────────────────────────────
  const addrIcon = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes("home"))   return <Home size={13} className="shrink-0" />;
    if (l.includes("office")) return <Building2 size={13} className="shrink-0" />;
    return <MapPin size={13} className="shrink-0" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25 }}
      className="space-y-5"
    >
      <div>
        <h2 className="text-xl font-bold text-brand-navy">Where should we arrive?</h2>
        <p className="text-sm text-brand-navy/40 mt-1">
          {showAddressCards
            ? "Select a saved address or enter a new one"
            : "We'll confirm service coverage by your PIN code first"}
        </p>
      </div>

      {/* ── [B-S2] Saved Address Cards ─────────────────────────────────────── */}
      {showAddressCards && (
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[11px] font-bold text-brand-navy/40 uppercase tracking-wide whitespace-nowrap">
              Your saved addresses
            </span>
            <div className="h-px bg-slate-200 flex-1" />
          </div>

          <div className="space-y-2">
            {myAddresses.map((addr) => {
              const isSelected = data.selectedAddressId === addr.addressId;
              return (
                <button
                  key={addr.addressId}
                  onClick={() => handleAddressSelect(addr)}
                  className={`w-full text-left p-3.5 rounded-xl border-2 flex items-start gap-3 transition-all ${
                    isSelected
                      ? "border-brand-gold bg-brand-gold/5 shadow-sm"
                      : "border-slate-100 bg-white hover:border-brand-gold/40 hover:shadow-sm"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected ? "bg-brand-gold/20 text-brand-gold" : "bg-slate-100 text-brand-navy/40"
                  }`}>
                    {addrIcon(addr.addressLabel)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-bold ${isSelected ? "text-brand-navy" : "text-brand-navy/70"}`}>
                        {addr.addressLabel}
                      </span>
                      {addr.isDefault && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 bg-brand-gold/10 text-brand-gold rounded-md">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-brand-navy/60 mt-0.5 truncate">{addr.addressLine1}</p>
                    <p className="text-[11px] text-brand-navy/40 mt-0.5">
                      {addr.cityName} · {addr.pincode}
                    </p>
                    {isSelected && isValidating && (
                      <p className="text-[11px] text-brand-gold flex items-center gap-1 mt-1">
                        <Loader2 size={10} className="animate-spin" /> Verifying coverage…
                      </p>
                    )}
                    {isSelected && pinStatus === "valid" && data.zoneName && (
                      <p className="text-[11px] text-green-600 font-semibold flex items-center gap-1 mt-1">
                        <Check size={10} strokeWidth={3} /> Zone: {data.zoneName}
                      </p>
                    )}
                    {isSelected && pinStatus === "invalid" && (
                      <p className="text-[11px] text-red-500 font-semibold flex items-center gap-1 mt-1">
                        <AlertCircle size={10} /> Area not serviceable
                      </p>
                    )}
                  </div>
                  {isSelected && (
                    <Check size={16} className="text-brand-gold shrink-0 mt-1" strokeWidth={2.5} />
                  )}
                </button>
              );
            })}
          </div>

          {/* "Enter a different address" toggle */}
          {!showManualForm ? (
            <button
              onClick={handleEnterDifferentAddress}
              className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-brand-gold hover:underline"
            >
              <ChevronDown size={13} /> Enter a different address
            </button>
          ) : (
            <button
              onClick={() => {
                // Re-collapse if there's a valid saved address still selected
                if (data.selectedAddressId) setShowManualForm(false);
              }}
              className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-brand-navy/40 hover:text-brand-navy"
            >
              <ChevronRight size={13} /> Use a saved address
            </button>
          )}
        </div>
      )}

      {/* ── Manual Entry Form ──────────────────────────────────────────────── */}
      {/* Guest: always shown. Logged-in: shown when showManualForm=true */}
      <AnimatePresence>
        {(!showAddressCards || showManualForm) && (
          <motion.div
            initial={showAddressCards ? { opacity: 0, height: 0 } : false}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden space-y-5"
          >
            {/* PIN Code */}
            <div>
              <label className={labelBase}>
                PIN / Postal Code <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="6-digit PIN code"
                  value={data.pincode}
                  onChange={(e) =>
                    onUpdate({ pincode: e.target.value.replace(/\D/g, ""), zoneId: null, zoneName: "" })
                  }
                  className={`${inputBase} pr-10 ${
                    pinStatus === "invalid" ? "border-red-300 focus:border-red-400" :
                    pinStatus === "valid"   ? "border-green-400 focus:border-green-500" : ""
                  }`}
                />
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                  {isValidating && <Loader2 size={14} className="animate-spin text-brand-gold" />}
                  {!isValidating && pinStatus === "valid"   && <Check size={14} className="text-green-500" />}
                  {!isValidating && pinStatus === "invalid" && <AlertCircle size={14} className="text-red-400" />}
                </div>
              </div>
              {pinStatus === "valid" && data.zoneName && (
                <div className="mt-2 inline-flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                  <Check size={11} strokeWidth={3} /> Zone: {data.zoneName} — we serve this area
                </div>
              )}
              {pinStatus === "invalid" && (
                <div className="mt-2 p-3 bg-red-50 border border-red-100 rounded-xl">
                  <p className="text-xs font-semibold text-red-600 flex items-center gap-1.5">
                    <AlertCircle size={12} /> We don't currently serve this PIN code.
                  </p>
                  <p className="text-xs text-red-500 mt-0.5">
                    Try a nearby PIN or{" "}
                    <a href="https://wa.me/" target="_blank" rel="noreferrer" className="underline font-semibold">
                      WhatsApp us to enquire
                    </a>
                    .
                  </p>
                </div>
              )}
              {data.pincode.length > 0 && data.pincode.length < 6 && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle size={11} /> Please enter a valid 6-digit PIN code.
                </p>
              )}
            </div>

            {/* Address fields — revealed after serviceable PIN */}
            <AnimatePresence>
              {isServiceable && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden space-y-4"
                >
                  <div>
                    <label className={labelBase}>
                      Address Line 1 <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={128}
                      placeholder="House / flat number and street name"
                      className={inputBase}
                      value={data.addressLine1}
                      onChange={(e) => onUpdate({ addressLine1: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={labelBase}>
                      Address Line 2{" "}
                      <span className="normal-case tracking-normal font-normal text-brand-navy/30">
                        (optional)
                      </span>
                    </label>
                    <input
                      type="text"
                      maxLength={128}
                      placeholder="Apartment name, floor, landmark (optional)"
                      className={inputBase}
                      value={data.addressLine2}
                      onChange={(e) => onUpdate({ addressLine2: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={labelBase}>City</label>
                    <input
                      type="text"
                      placeholder="City"
                      className={inputBase}
                      value={data.cityName}
                      onChange={(e) => onUpdate({ cityName: e.target.value })}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Step 3: Date & Time Slot ─────────────────────────────────────────────────
// Identical for both journeys (SHARED-S3)

interface Step3Props {
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
}

type TimeWindow = "Morning" | "Afternoon" | "Evening";

const TIME_WINDOWS: { id: TimeWindow; label: string; range: string; startHour: number; endHour: number }[] = [
  { id: "Morning",   label: "Morning",   range: "8:00 AM – 12:00 PM", startHour: 8,  endHour: 12 },
  { id: "Afternoon", label: "Afternoon", range: "12:00 PM – 4:00 PM", startHour: 12, endHour: 16 },
  { id: "Evening",   label: "Evening",   range: "4:00 PM – 7:00 PM",  startHour: 16, endHour: 19 },
];

function buildCalendarDays() {
  const today = new Date();
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return {
      full:    d.toISOString().split("T")[0],
      day:     d.toLocaleDateString("en-US", { weekday: "short" }),
      date:    d.getDate(),
      month:   d.toLocaleDateString("en-US", { month: "short" }),
      isToday: i === 0,
    };
  });
}

function Step3({ data, onUpdate }: Step3Props) {
  const [slots, setSlots]               = useState<SlotAvailabilityResponse[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const calendarDays                    = buildCalendarDays();
  const now                             = new Date();
  const todayAvailable                  = now.getHours() < 4;

  useEffect(() => {
    if (!data.slotDate || !data.zoneId) { setSlots([]); return; }
    setSlotsLoading(true);
    CatalogService.getAvailableSlots(data.zoneId, data.slotDate)
      .then((d) => setSlots(d ?? []))
      .catch(() => setSlots([]))
      .finally(() => setSlotsLoading(false));
  }, [data.slotDate, data.zoneId]);

  const windowAvailability = (win: typeof TIME_WINDOWS[0]) => {
    const windowSlots = slots.filter((s) => {
      const h = parseInt(s.startTime.split(":")[0], 10);
      return h >= win.startHour && h < win.endHour;
    });
    const available = windowSlots.filter((s) => !s.isFullyBooked);
    return { total: windowSlots.length, available: available.length, firstSlot: available[0] ?? null };
  };

  const handleDateSelect = (dateStr: string) => {
    onUpdate({ slotDate: dateStr, slotAvailabilityId: null, slotWindow: null, isEmergency: false, emergencySurcharge: 0 });
  };

  const handleWindowSelect = (win: TimeWindow) => {
    const avail = windowAvailability(TIME_WINDOWS.find((w) => w.id === win)!);
    onUpdate({ slotWindow: win, slotAvailabilityId: avail.firstSlot?.slotAvailabilityId ?? null, isEmergency: false, emergencySurcharge: 0 });
  };

  const handleEmergency = () => {
    onUpdate({ isEmergency: true, slotDate: new Date().toISOString().split("T")[0], slotWindow: "Emergency", slotAvailabilityId: null, emergencySurcharge: 499 });
  };

  const deSelectEmergency = () => {
    onUpdate({ isEmergency: false, slotWindow: null, emergencySurcharge: 0 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-xl font-bold text-brand-navy">Pick your appointment.</h2>
        <p className="text-sm text-brand-navy/40 mt-1">Select a date and preferred time window</p>
      </div>

      {/* 14-day calendar grid */}
      <div>
        <label className={labelBase}>Select Date</label>
        <div className="grid grid-cols-7 gap-1.5">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <div key={d} className="text-center text-[10px] font-bold text-brand-navy/30 uppercase pb-1">
              {d}
            </div>
          ))}
          {(() => {
            const firstDate  = new Date(calendarDays[0].full);
            const offset     = (firstDate.getDay() + 6) % 7;
            return Array.from({ length: offset }, (_, i) => <div key={`off-${i}`} />);
          })()}
          {calendarDays.map((day) => {
            const isSelected = data.slotDate === day.full;
            const isDisabled = day.isToday && !todayAvailable;
            return (
              <button
                key={day.full}
                disabled={isDisabled}
                onClick={() => handleDateSelect(day.full)}
                className={`flex flex-col items-center py-2 rounded-xl text-center transition-all ${
                  isSelected
                    ? "bg-brand-navy text-white ring-2 ring-brand-gold ring-offset-1 shadow-md"
                    : isDisabled
                    ? "opacity-30 cursor-not-allowed"
                    : "hover:bg-brand-gold/10 text-brand-navy"
                }`}
              >
                <span className={`text-[10px] font-bold uppercase ${isSelected ? "text-white/60" : "text-brand-navy/40"}`}>{day.day}</span>
                <span className={`text-base font-bold leading-tight ${isSelected ? "text-white" : "text-brand-navy"}`}>{day.date}</span>
                <span className={`text-[9px] font-semibold ${isSelected ? "text-white/60" : "text-brand-navy/30"}`}>{day.month}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time window cards */}
      <AnimatePresence>
        {data.slotDate && !data.isEmergency && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
            <label className={labelBase}>Preferred Time</label>
            {slotsLoading ? (
              <div className="flex items-center gap-3 py-4">
                <Loader2 className="animate-spin text-brand-gold" size={18} />
                <span className="text-sm text-brand-navy/40">Checking availability…</span>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {TIME_WINDOWS.map((win) => {
                  const avail      = windowAvailability(win);
                  const isFull     = avail.total > 0 && avail.available === 0;
                  const isLimited  = avail.available === 1;
                  const isSelected = data.slotWindow === win.id;
                  const hasNoData  = avail.total === 0 && !slotsLoading;
                  return (
                    <button
                      key={win.id}
                      disabled={isFull || hasNoData}
                      onClick={() => handleWindowSelect(win.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        isSelected
                          ? "border-brand-gold bg-brand-navy text-white shadow-md"
                          : isFull || hasNoData
                          ? "border-slate-100 bg-slate-50 opacity-50 cursor-not-allowed"
                          : "border-slate-200 bg-white hover:border-brand-gold/60 hover:shadow-sm"
                      }`}
                    >
                      <p className={`text-sm font-bold ${isSelected ? "text-white" : "text-brand-navy"}`}>{win.label}</p>
                      <p className={`text-[11px] mt-0.5 ${isSelected ? "text-white/60" : "text-brand-navy/40"}`}>{win.range}</p>
                      <div className="mt-2">
                        {isFull    ? <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-md">Full</span>
                        : isLimited ? <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">1 slot left</span>
                        : hasNoData ? <span className="text-[10px] font-bold text-brand-navy/30">—</span>
                        : <span className={`text-[10px] font-bold ${isSelected ? "text-white/50" : "text-green-600"}`}>{avail.available} slots</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emergency card */}
      {!data.isEmergency ? (
        <button
          onClick={handleEmergency}
          className="w-full text-left p-4 rounded-xl border-2 border-amber-200 bg-amber-50 hover:border-amber-400 transition-all"
          style={{ borderLeftWidth: "4px", borderLeftColor: "#F59E0B" }}
        >
          <div className="flex items-start gap-3">
            <Flame size={18} className="text-amber-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-bold text-brand-navy">Need it urgently? Emergency service</p>
              <p className="text-xs text-brand-navy/60 mt-0.5">Technician dispatched within 4 hours — available today only.</p>
              <p className="text-xs font-semibold text-amber-600 mt-1.5">Priority charge: ₹499</p>
            </div>
          </div>
        </button>
      ) : (
        <div className="p-4 rounded-xl border-2 border-amber-400 bg-amber-50" style={{ borderLeftWidth: "4px", borderLeftColor: "#F59E0B" }}>
          <div className="flex items-start gap-3">
            <Flame size={18} className="text-amber-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-bold text-green-700 flex items-center gap-2">
                <CheckCircle2 size={15} /> Emergency service selected
              </p>
              <p className="text-xs text-brand-navy/60 mt-0.5">
                A technician will be dispatched within 4 hours. Priority charge: ₹499.
              </p>
            </div>
            <button onClick={deSelectEmergency} className="text-brand-navy/30 hover:text-brand-navy transition-colors shrink-0">
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ─── Step 4: Contact Details ───────────────────────────────────────────────────
// Journey A [A-S4]: name + mobile + OTP + special instructions + coupon
// Journey B [B-S4]: read-only name/mobile + special instructions + loyalty coupon chip + coupon
// API (B-S4): GET /api/customers/me/profile (parent loads myMobile)
//             GET /api/offers (parent loads loyaltyOffers)

interface Step4Props {
  data: WizardData;
  isLoggedIn: boolean;
  myMobile: string;
  loyaltyOffers: PromotionalOffer[];
  onUpdate: (updates: Partial<WizardData>) => void;
}

function Step4({ data, isLoggedIn, myMobile, loyaltyOffers, onUpdate }: Step4Props) {
  // OTP state (guest only — transient UI state, not in WizardData)
  const [otpSent, setOtpSent]           = useState(false);
  const [otpValue, setOtpValue]         = useState("");
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [otpAttempts, setOtpAttempts]   = useState(0);
  const [otpLocked, setOtpLocked]       = useState(false);
  const [otpSending, setOtpSending]     = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpError, setOtpError]         = useState("");

  // Coupon state
  const [couponInput, setCouponInput]     = useState(data.appliedCoupon);
  const [couponOpen, setCouponOpen]       = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError]     = useState("");

  const otpRefs = Array.from({ length: 6 }, () => useRef<HTMLInputElement>(null)); // eslint-disable-line react-hooks/rules-of-hooks

  const mobileClean  = data.guestMobile.replace(/\D/g, "");
  const isMobileValid = /^[2-9]\d{9}$/.test(mobileClean);

  // Loyalty offer with a coupon code (first one wins)
  const loyaltyCoupon = loyaltyOffers.find((o) => !!o.couponCode);

  // OTP countdown
  useEffect(() => {
    if (otpCountdown <= 0) return;
    const t = setTimeout(() => setOtpCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [otpCountdown]);

  const sendOtp = async () => {
    setOtpSending(true); setOtpError("");
    try {
      await AuthService.sendOtp(mobileClean);
      setOtpSent(true); setOtpCountdown(60); setOtpValue("");
    } catch { setOtpError("Failed to send OTP. Please try again."); }
    finally { setOtpSending(false); }
  };

  const verifyOtp = async (code: string) => {
    if (code.length < 6) return;
    if (otpAttempts >= 3) { setOtpLocked(true); setOtpError("Too many attempts. Please wait 10 minutes before requesting a new code."); return; }
    setOtpVerifying(true); setOtpError("");
    try {
      await apiClient.post("/api/auth/otp/verify", { phone: mobileClean, otp: code });
      onUpdate({ mobileVerified: true, guestMobile: mobileClean });
    } catch {
      const remaining = 2 - otpAttempts;
      setOtpAttempts((a) => a + 1);
      setOtpError(remaining > 0
        ? `Incorrect code. ${remaining} attempt${remaining > 1 ? "s" : ""} remaining.`
        : "Too many attempts. Please wait 10 minutes before requesting a new code."
      );
      setOtpValue(""); otpRefs[0].current?.focus();
      if (remaining <= 0) setOtpLocked(true);
    }
    finally { setOtpVerifying(false); }
  };

  const handleOtpDigit = (index: number, value: string) => {
    const digit   = value.replace(/\D/g, "").slice(-1);
    const newOtp  = otpValue.split("").concat(Array(6).fill("")).slice(0, 6);
    newOtp[index] = digit;
    const combined = newOtp.join("").slice(0, 6);
    setOtpValue(combined);
    if (digit && index < 5) otpRefs[index + 1].current?.focus();
    if (combined.length === 6) verifyOtp(combined);
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpValue[index] && index > 0) otpRefs[index - 1].current?.focus();
  };

  const applyLoyaltyCoupon = () => {
    if (!loyaltyCoupon?.couponCode) return;
    validateCoupon(loyaltyCoupon.couponCode);
  };

  const validateCoupon = async (code: string) => {
    const codeToValidate = code || couponInput.trim();
    if (!codeToValidate) return;
    setCouponLoading(true); setCouponError("");
    try {
      const res = await apiClient.post<{ discountAmount: number; message: string }>(
        "/api/customer-marketing/offers/validate-coupon",
        { couponCode: codeToValidate, serviceTypeId: data.serviceTypeId },
      );
      onUpdate({ appliedCoupon: codeToValidate, discountAmount: res.discountAmount });
      setCouponInput(codeToValidate);
    } catch { setCouponError("This code is invalid or has expired."); }
    finally { setCouponLoading(false); }
  };

  const removeCoupon = () => {
    onUpdate({ appliedCoupon: "", discountAmount: 0 });
    setCouponInput(""); setCouponError("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25 }}
      className="space-y-5"
    >
      <div>
        <h2 className="text-xl font-bold text-brand-navy">Your details.</h2>
        <p className="text-sm text-brand-navy/40 mt-1">
          {isLoggedIn
            ? "Confirm your contact and add any access notes"
            : "We'll use these details to confirm your booking"}
        </p>
      </div>

      {isLoggedIn ? (
        /* ── [B-S4] Logged-in: read-only contact ───────────────────────────── */
        <div className="flex items-center gap-4 p-4 bg-brand-gold/5 border border-brand-gold/20 rounded-xl">
          <div className="w-10 h-10 bg-brand-navy rounded-full flex items-center justify-center shrink-0">
            <User size={16} className="text-brand-gold" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-brand-navy">Booking for: {data.guestName}</p>
            <p className="text-xs text-brand-navy/50 mt-0.5 font-mono">
              +91 {myMobile ? maskMobile(myMobile) : "••••••••••"}
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <ShieldCheck size={13} className="text-brand-gold" />
            <span className="text-[11px] font-semibold text-brand-gold">Verified</span>
          </div>
        </div>
      ) : (
        /* ── [A-S4] Guest: name + mobile + OTP ──────────────────────────────── */
        <>
          {/* Full Name */}
          <div>
            <label className={labelBase}>
              Full Name <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-navy/30 pointer-events-none" />
              <input
                type="text"
                maxLength={128}
                placeholder="Your full name"
                className={`${inputBase} pl-10`}
                value={data.guestName}
                onChange={(e) => onUpdate({ guestName: e.target.value })}
              />
            </div>
          </div>

          {/* Mobile */}
          <div>
            <label className={labelBase}>Mobile Number <span className="text-red-400">*</span></label>
            <div className="flex gap-2">
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 text-sm font-semibold text-brand-navy/60 shrink-0">
                +91
              </div>
              <div className="relative flex-1">
                <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-navy/30 pointer-events-none" />
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="10-digit mobile number"
                  className={`${inputBase} pl-10 pr-24 ${data.mobileVerified ? "border-green-400" : ""}`}
                  value={data.guestMobile}
                  disabled={data.mobileVerified}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                    onUpdate({ guestMobile: val, mobileVerified: false });
                    setOtpSent(false); setOtpValue(""); setOtpError("");
                  }}
                />
                {data.mobileVerified ? (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-green-600">
                    <CheckCircle2 size={15} strokeWidth={2.5} />
                    <span className="text-[11px] font-bold">Verified</span>
                  </div>
                ) : isMobileValid && !otpSent && (
                  <button
                    onClick={sendOtp}
                    disabled={otpSending}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-brand-navy text-white text-[11px] font-bold px-3 py-1.5 rounded-lg hover:bg-brand-gold hover:text-brand-navy transition-all disabled:opacity-50"
                  >
                    {otpSending ? <Loader2 size={12} className="animate-spin" /> : "Verify"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* OTP input */}
          <AnimatePresence>
            {otpSent && !data.mobileVerified && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <p className="text-xs font-semibold text-brand-navy/60">
                    Enter the 6-digit code sent to +91 {data.guestMobile}
                  </p>
                  <div className="flex gap-2 justify-center">
                    {Array.from({ length: 6 }, (_, i) => (
                      <input
                        key={i}
                        ref={otpRefs[i]}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        disabled={otpLocked || otpVerifying}
                        value={otpValue[i] ?? ""}
                        onChange={(e) => handleOtpDigit(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        className={`w-11 h-12 text-center text-lg font-bold border-2 rounded-xl outline-none transition-all ${
                          otpVerifying ? "border-brand-gold bg-brand-gold/10"
                          : otpError    ? "border-red-300 bg-red-50"
                          : "border-slate-200 bg-white focus:border-brand-gold"
                        } disabled:opacity-50`}
                      />
                    ))}
                  </div>
                  {otpVerifying && (
                    <p className="text-center text-xs text-brand-navy/40 flex items-center justify-center gap-1.5">
                      <Loader2 size={12} className="animate-spin text-brand-gold" /> Verifying…
                    </p>
                  )}
                  {otpError && (
                    <p className="text-center text-xs font-semibold text-red-500 flex items-center justify-center gap-1">
                      <AlertCircle size={11} /> {otpError}
                    </p>
                  )}
                  <div className="text-center text-xs text-brand-navy/40">
                    {otpCountdown > 0 ? (
                      <span>Resend in <span className="font-bold text-brand-navy/60 tabular-nums">00:{String(otpCountdown).padStart(2, "0")}</span></span>
                    ) : (
                      <button onClick={sendOtp} disabled={otpLocked} className="font-semibold text-brand-gold hover:underline disabled:opacity-40">
                        Resend OTP
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* Special Instructions (both journeys — always blank on entry) */}
      <div>
        <label className={labelBase}>
          Special Instructions{" "}
          <span className="normal-case tracking-normal font-normal text-brand-navy/30">(optional)</span>
        </label>
        <textarea
          rows={3}
          maxLength={250}
          placeholder="Any instructions for the technician? (e.g. gate code, building name, floor, dog at home)"
          className={`${inputBase} resize-none`}
          value={data.specialInstructions}
          onChange={(e) => onUpdate({ specialInstructions: e.target.value })}
        />
        <p className="mt-1 text-right text-[11px] text-brand-navy/30">
          {data.specialInstructions.length} / 250
        </p>
      </div>

      {/* Coupon — [B-S4] includes loyalty coupon pre-apply chip */}
      <div className="space-y-2">
        {/* [B-S4] Loyalty coupon chip */}
        {isLoggedIn && loyaltyCoupon && !data.appliedCoupon && (
          <div className="flex items-center gap-3 p-3 bg-brand-gold/5 border border-brand-gold/30 rounded-xl">
            <Tag size={14} className="text-brand-gold shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-brand-navy">
                You have a promo available: <span className="text-brand-gold">{loyaltyCoupon.couponCode}</span>
              </p>
              {loyaltyCoupon.title && (
                <p className="text-[11px] text-brand-navy/50 mt-0.5 truncate">{loyaltyCoupon.title}</p>
              )}
            </div>
            <button
              onClick={applyLoyaltyCoupon}
              disabled={couponLoading}
              className="px-3 py-1.5 bg-brand-navy text-white text-[11px] font-bold rounded-lg hover:bg-brand-gold hover:text-brand-navy transition-all disabled:opacity-50 shrink-0"
            >
              {couponLoading ? <Loader2 size={11} className="animate-spin" /> : "Apply"}
            </button>
          </div>
        )}

        {/* Applied coupon display */}
        {data.appliedCoupon ? (
          <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
            <Tag size={14} className="text-green-600 shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-bold text-green-700">{data.appliedCoupon} applied</p>
              <p className="text-xs text-green-600 mt-0.5">₹{data.discountAmount.toLocaleString()} off your service</p>
            </div>
            <button onClick={removeCoupon} className="text-xs font-semibold text-red-500 hover:underline shrink-0">
              Remove
            </button>
          </div>
        ) : !couponOpen ? (
          <button
            onClick={() => setCouponOpen(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-brand-gold hover:underline"
          >
            <Tag size={13} /> Have a promo code? Apply it here.
          </button>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden"
            >
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-navy/30 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Enter promo code"
                    className={`${inputBase} pl-10 uppercase`}
                    value={couponInput}
                    onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError(""); }}
                  />
                </div>
                <button
                  onClick={() => validateCoupon(couponInput)}
                  disabled={!couponInput.trim() || couponLoading}
                  className="px-4 py-2.5 bg-brand-navy text-white text-sm font-semibold rounded-xl hover:bg-brand-gold hover:text-brand-navy transition-all disabled:opacity-40 shrink-0"
                >
                  {couponLoading ? <Loader2 size={14} className="animate-spin" /> : "Apply"}
                </button>
              </div>
              {couponError && (
                <p className="mt-1.5 text-xs font-semibold text-red-500 flex items-center gap-1">
                  <AlertCircle size={11} /> {couponError}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}

// ─── Step 5: Summary & Confirm ─────────────────────────────────────────────────
// SHARED-S5: 4 summary cards + pricing block + T&C + CTA
// Journey A addition: no guest registration prompt here (shown on confirmation page)
// Journey B: no guest-specific elements

interface Step5Props {
  data: WizardData;
  isLoggedIn: boolean;
  onUpdate: (updates: Partial<WizardData>) => void;
  onEdit: (step: number) => void;
  isSubmitting: boolean;
  submitError: string;
}

function Step5({ data, onUpdate, onEdit, isSubmitting, submitError }: Step5Props) {
  const estimatedBase    = data.serviceBasePrice ?? 0;
  const subtotal         = estimatedBase * data.unitCount;
  const total            = subtotal + data.emergencySurcharge - data.discountAmount;
  const hasPrice         = estimatedBase > 0;
  const showAdjustments  = data.discountAmount > 0 || data.emergencySurcharge > 0;

  const formattedDate = data.slotDate
    ? new Date(data.slotDate + "T12:00:00").toLocaleDateString("en-US", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
      })
    : "—";

  const windowLabels: Record<string, string> = {
    Morning:   "Morning: 8:00 AM – 12:00 PM",
    Afternoon: "Afternoon: 12:00 PM – 4:00 PM",
    Evening:   "Evening: 4:00 PM – 7:00 PM",
    Emergency: "Emergency — within 4 hours",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25 }}
      className="space-y-4"
    >
      <div>
        <h2 className="text-xl font-bold text-brand-navy">Review your booking.</h2>
        <p className="text-sm text-brand-navy/40 mt-1">Check the details — you can edit any section.</p>
      </div>

      {/* Card 1 — Service */}
      <SummaryCard label="Service" onEdit={() => onEdit(1)}>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-brand-gold/10 rounded-lg flex items-center justify-center text-brand-gold shrink-0">
            {getCategoryIcon(data.serviceTypeName)}
          </div>
          <div>
            <p className="text-sm font-semibold text-brand-navy">{data.serviceTypeName || "—"}</p>
            {data.serviceSubTypeName && (
              <p className="text-xs text-brand-navy/50 mt-0.5">{data.serviceSubTypeName}</p>
            )}
            <p className="text-xs text-brand-navy/40 mt-0.5">
              {[
                data.acTypeName,
                data.unitCount > 1 ? `${data.unitCount} units` : null,
                data.selectedEquipmentName ? `Equipment: ${data.selectedEquipmentName}` : null,
              ].filter(Boolean).join(" · ")}
            </p>
          </div>
        </div>
      </SummaryCard>

      {/* Card 2 — Location */}
      <SummaryCard label="Location" onEdit={() => onEdit(2)}>
        <div className="flex items-start gap-2">
          <MapPin size={14} className="text-brand-gold shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-brand-navy">{data.addressLine1 || "—"}</p>
            {data.addressLine2 && <p className="text-xs text-brand-navy/50">{data.addressLine2}</p>}
            <p className="text-xs text-brand-navy/50 mt-0.5">
              {[data.cityName, data.pincode, data.zoneName].filter(Boolean).join(" · ")}
            </p>
          </div>
        </div>
      </SummaryCard>

      {/* Card 3 — Appointment */}
      <SummaryCard label="Appointment" onEdit={() => onEdit(3)}>
        <div className="flex items-start gap-2">
          <Calendar size={14} className="text-brand-gold shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-brand-navy">{formattedDate}</p>
            <p className="text-xs text-brand-navy/50 mt-0.5">
              {data.slotWindow ? windowLabels[data.slotWindow] ?? data.slotWindow : "—"}
            </p>
            {data.isEmergency && (
              <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 bg-amber-50 text-amber-600 text-[10px] font-bold rounded-md">
                <Flame size={10} /> Emergency
              </span>
            )}
          </div>
        </div>
      </SummaryCard>

      {/* Card 4 — Contact */}
      <SummaryCard label="Contact" onEdit={() => onEdit(4)}>
        <div className="flex items-center gap-2">
          <User size={14} className="text-brand-gold shrink-0" />
          <div>
            <p className="text-sm font-semibold text-brand-navy">{data.guestName || "—"}</p>
            <p className="text-xs text-brand-navy/50 mt-0.5 font-mono">
              +91 {data.guestMobile ? maskMobile(data.guestMobile) : "••••••••••"}
            </p>
          </div>
        </div>
      </SummaryCard>

      {/* Pricing block */}
      <div className="bg-brand-navy rounded-xl p-5 space-y-2.5">
        <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wide">Estimated Charges</p>
        {hasPrice ? (
          <div className="flex justify-between text-sm">
            <span className="text-white/60">
              {data.serviceSubTypeName || data.serviceTypeName}{data.unitCount > 1 ? ` × ${data.unitCount}` : ""}
            </span>
            <span className="text-white font-semibold">₹{subtotal.toLocaleString()}</span>
          </div>
        ) : (
          <p className="text-sm text-white/60 leading-relaxed">
            Estimated service charge: confirmed after technician inspection.
          </p>
        )}
        {showAdjustments && (
          <>
            {data.discountAmount > 0 && (
              <div className="flex justify-between text-sm text-green-400">
                <span>Coupon {data.appliedCoupon}</span>
                <span>− ₹{data.discountAmount.toLocaleString()}</span>
              </div>
            )}
            {data.emergencySurcharge > 0 && (
              <div className="flex justify-between text-sm text-amber-400">
                <span>Emergency priority charge</span>
                <span>+ ₹{data.emergencySurcharge.toLocaleString()}</span>
              </div>
            )}
            {hasPrice && (
              <div className="pt-3 mt-1 border-t border-white/10 flex justify-between items-center">
                <span className="text-xs font-semibold text-white/40 uppercase tracking-wide">Estimated Total</span>
                <span className="text-2xl font-bold text-brand-gold">₹{total.toLocaleString()}</span>
              </div>
            )}
          </>
        )}
        <p className="text-[11px] text-white/30 pt-1">
          Applicable GST will be added to your final invoice. No surprise charges.
        </p>
      </div>

      {/* T&C checkbox */}
      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          type="checkbox"
          checked={data.termsAccepted}
          onChange={(e) => onUpdate({ termsAccepted: e.target.checked })}
          className="mt-0.5 w-4 h-4 accent-brand-gold shrink-0 cursor-pointer"
        />
        <span className="text-xs text-brand-navy/50 leading-relaxed group-hover:text-brand-navy/70 transition-colors">
          I agree to CoolElite's{" "}
          <Link to="/terms" className="text-brand-gold font-semibold hover:underline">Terms of Service</Link>{" "}
          and{" "}
          <Link to="/terms" className="text-brand-gold font-semibold hover:underline">Cancellation Policy</Link>.
        </span>
      </label>

      {/* Submit error */}
      {submitError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl">
          <AlertCircle size={14} className="text-red-500 shrink-0" />
          <p className="text-xs font-semibold text-red-600">{submitError}</p>
        </div>
      )}

      {/* Trust strip */}
      <div className="flex items-center justify-center gap-6 pt-2 flex-wrap">
        {[
          { icon: <ShieldCheck size={13} />, label: "Verified technicians" },
          { icon: <CheckCircle2 size={13} />, label: "SSL secured" },
          { icon: <Star size={13} />, label: "Digital report after every visit" },
        ].map(({ icon, label }) => (
          <div key={label} className="flex items-center gap-1.5 text-brand-navy/30">
            <span className="text-brand-gold">{icon}</span>
            <span className="text-[11px] font-semibold">{label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Summary Card (reusable sub-component) ────────────────────────────────────

function SummaryCard({
  label, onEdit, children,
}: {
  label: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2.5">
        <p className="text-[11px] font-semibold text-brand-navy/40 uppercase tracking-wide">{label}</p>
        <button onClick={onEdit} className="text-xs font-semibold text-brand-gold hover:underline">
          Edit
        </button>
      </div>
      {children}
    </div>
  );
}
