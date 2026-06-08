import React, { useState, useEffect, useCallback, useRef } from "react";
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
  Star,
  Loader2,
} from "lucide-react";
import { AddressService } from "../../services/addressService";
import type { CustomerAddressResponse, CreateCustomerAddressRequest } from "../../types/address";

interface AddressForm {
  label: string;
  line1: string;
  line2: string;
  city: string;
  pin: string;
  zoneId?: number;
}

const emptyForm: AddressForm = {
  label: 'Home',
  line1: '',
  line2: '',
  city: 'Hyderabad',
  pin: '',
};

export default function Addresses() {
  const [addresses, setAddresses] = useState<CustomerAddressResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<AddressForm>(emptyForm);
  const [isZoneValid, setIsZoneValid] = useState<boolean | null>(null);
  const [zoneName, setZoneName] = useState('');
  const [saving, setSaving] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const pinTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const loadAddresses = useCallback(async () => {
    try {
      const result = await AddressService.getMyAddresses();
      setAddresses(result ?? []);
    } catch {
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAddresses(); }, []);

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setForm((f) => ({ ...f, pin: val, zoneId: undefined }));
    setIsZoneValid(null);
    setZoneName('');
    clearTimeout(pinTimerRef.current);
    if (val.length === 6) {
      pinTimerRef.current = setTimeout(async () => {
        try {
          const zone = await AddressService.getZoneByPincode(val);
          setIsZoneValid(zone.isServiceable);
          setZoneName(zone.zoneName ?? '');
          setForm((f) => ({ ...f, zoneId: zone.isServiceable ? zone.zoneId : undefined }));
        } catch {
          setIsZoneValid(false);
          setZoneName('');
        }
      }, 400);
    }
  };

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm);
    setIsZoneValid(null);
    setZoneName('');
    setIsModalOpen(true);
  };

  const openEdit = (addr: CustomerAddressResponse) => {
    setEditId(addr.addressId);
    setForm({
      label: addr.addressLabel,
      line1: addr.addressLine1,
      line2: addr.addressLine2 ?? '',
      city: addr.cityName,
      pin: addr.pincode,
      zoneId: addr.zoneId,
    });
    setIsZoneValid(addr.zoneName ? true : null);
    setZoneName(addr.zoneName ?? '');
    setMenuOpenId(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: CreateCustomerAddressRequest = {
        addressLabel: form.label,
        addressLine1: form.line1,
        addressLine2: form.line2 || undefined,
        cityName: form.city,
        pincode: form.pin,
        zoneId: form.zoneId,
      };
      if (editId !== null) {
        await AddressService.updateAddress(editId, payload);
      } else {
        await AddressService.createAddress(payload);
      }
      setIsModalOpen(false);
      await loadAddresses();
    } catch {
      /* silent — user can retry */
    } finally {
      setSaving(false);
    }
  };

  const handleSetDefault = async (addressId: number) => {
    try {
      await AddressService.updateAddress(addressId, { isDefault: true });
      await loadAddresses();
    } catch {
      /* silent */
    }
  };

  const handleDelete = async (addressId: number) => {
    setMenuOpenId(null);
    try {
      await AddressService.deleteAddress(addressId);
      await loadAddresses();
    } catch {
      /* silent */
    }
  };

  return (
    <div className="max-w-7xl mx-auto" onClick={() => setMenuOpenId(null)}>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 mb-12">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif text-brand-navy mb-2 grayscale-0">My Addresses</h1>
          <p className="text-brand-navy/40 text-[10px] uppercase tracking-[0.3em] font-bold">Manage your service locations</p>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); openAdd(); }}
          className="w-full sm:w-auto flex items-center justify-center gap-3 bg-brand-navy text-white px-8 py-4 rounded-sm text-[10px] uppercase tracking-widest font-bold hover:bg-brand-gold transition-all shadow-xl"
        >
          <Plus size={16} /> Add New Address
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="animate-spin text-brand-gold" size={40} />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {addresses.map((addr) => (
            <motion.div
              key={addr.addressId}
              className="bg-white rounded-sm border border-brand-navy/5 shadow-sm hover:shadow-xl transition-all group overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-8">
                  <div className="w-12 h-12 bg-brand-navy/5 rounded-sm flex items-center justify-center text-brand-gold">
                    {addr.addressLabel === 'Home' ? (
                      <Home size={24} />
                    ) : addr.addressLabel === 'Office' ? (
                      <Briefcase size={24} />
                    ) : (
                      <MapPin size={24} />
                    )}
                  </div>
                  <div className="flex items-center gap-2 relative" onClick={(e) => e.stopPropagation()}>
                    {addr.isDefault && (
                      <span className="bg-brand-gold/10 text-brand-gold px-3 py-1 rounded-full text-[8px] uppercase tracking-widest font-bold flex items-center gap-1">
                        <Star size={8} className="fill-brand-gold" /> Default
                      </span>
                    )}
                    <button
                      onClick={() => setMenuOpenId(menuOpenId === addr.addressId ? null : addr.addressId)}
                      className="p-2 text-brand-navy/20 hover:text-brand-navy transition-colors"
                    >
                      <MoreVertical size={18} />
                    </button>
                    {menuOpenId === addr.addressId && (
                      <div className="absolute right-0 top-8 bg-white border border-brand-navy/10 rounded-sm shadow-xl z-10 min-w-[140px]">
                        <button
                          onClick={() => openEdit(addr)}
                          className="w-full text-left px-4 py-3 text-[10px] uppercase tracking-widest font-bold text-brand-navy hover:bg-brand-navy/5 transition-colors"
                        >
                          Edit
                        </button>
                        {!addr.isDefault && (
                          <button
                            onClick={() => handleDelete(addr.addressId)}
                            className="w-full text-left px-4 py-3 text-[10px] uppercase tracking-widest font-bold text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2"
                          >
                            <Trash2 size={12} /> Delete
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <h3 className="text-xl font-serif text-brand-navy mb-4">{addr.addressLabel}</h3>
                <p className="text-sm text-brand-navy/60 leading-relaxed mb-6 h-12 overflow-hidden">
                  {[addr.addressLine1, addr.addressLine2].filter(Boolean).join(', ')}
                </p>

                <div className="flex items-center gap-4 mb-8">
                  {addr.zoneName && (
                    <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                      <CheckCircle2 size={10} /> {addr.zoneName}
                    </div>
                  )}
                  <span className="text-[9px] uppercase tracking-widest font-bold text-brand-navy/40">
                    {addr.pincode}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => openEdit(addr)}
                    className="text-center py-3 border border-brand-navy/10 rounded-sm text-[9px] uppercase tracking-widest font-bold text-brand-navy hover:bg-brand-navy hover:text-white transition-all"
                  >
                    Edit
                  </button>
                  {!addr.isDefault && (
                    <button
                      onClick={() => handleSetDefault(addr.addressId)}
                      className="text-center py-3 bg-brand-navy/5 rounded-sm text-[9px] uppercase tracking-widest font-bold text-brand-navy hover:bg-brand-gold transition-all"
                    >
                      Set Default
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Add New Placeholder */}
          <button
            onClick={openAdd}
            className="bg-brand-navy/5 border-2 border-dashed border-brand-navy/10 rounded-sm p-8 flex flex-col items-center justify-center text-center group hover:border-brand-gold transition-all"
          >
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-brand-navy/20 group-hover:text-brand-gold transition-colors mb-4 shadow-sm">
              <Plus size={32} />
            </div>
            <h3 className="text-xl font-serif text-brand-navy/40 group-hover:text-brand-navy transition-colors">
              Add New Address
            </h3>
            <p className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/20 mt-2">
              Faster bookings await
            </p>
          </button>
        </div>
      )}

      {/* Add / Edit Address Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-brand-navy/60 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="fixed top-0 right-0 h-full w-full sm:max-w-md bg-white z-[110] shadow-2xl p-6 sm:p-10 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl font-serif text-brand-navy">
                  {editId !== null ? 'Edit Address' : 'Add Address'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-brand-navy/40 hover:text-brand-navy transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form className="space-y-6 sm:space-y-8" onSubmit={handleSave}>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">
                    Address Label
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Home', 'Office', 'Other'].map((lbl) => (
                      <button
                        key={lbl}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, label: lbl }))}
                        className={`py-3 border rounded-sm text-[9px] uppercase tracking-widest font-bold transition-all ${
                          form.label === lbl
                            ? 'bg-brand-navy text-white border-brand-navy'
                            : 'border-brand-navy/10 text-brand-navy hover:bg-brand-navy hover:text-white'
                        }`}
                      >
                        {lbl}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">
                    Address Line 1
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="House / Flat No., Building Name"
                    value={form.line1}
                    onChange={(e) => setForm((f) => ({ ...f, line1: e.target.value }))}
                    className="w-full bg-brand-navy/5 border border-transparent rounded-sm px-6 py-4 text-sm text-brand-navy focus:outline-none focus:border-brand-gold transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    placeholder="Street, Area, Landmark"
                    value={form.line2}
                    onChange={(e) => setForm((f) => ({ ...f, line2: e.target.value }))}
                    className="w-full bg-brand-navy/5 border border-transparent rounded-sm px-6 py-4 text-sm text-brand-navy focus:outline-none focus:border-brand-gold transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">City</label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                      className="w-full bg-brand-navy/5 border border-transparent rounded-sm px-6 py-4 text-sm text-brand-navy focus:outline-none focus:border-brand-gold transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">
                      PIN Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={form.pin}
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
                    className={`p-4 rounded-sm flex items-center gap-3 ${
                      isZoneValid
                        ? 'bg-green-50 text-green-600 border border-green-100'
                        : 'bg-red-50 text-red-500 border border-red-100'
                    }`}
                  >
                    {isZoneValid ? <CheckCircle2 size={16} /> : <Info size={16} />}
                    <span className="text-[10px] uppercase tracking-widest font-bold">
                      {isZoneValid
                        ? `Service Available — ${zoneName}`
                        : 'Service not yet available here'}
                    </span>
                  </motion.div>
                )}

                <div className="pt-8">
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-brand-navy text-white py-5 rounded-sm text-xs uppercase tracking-widest font-bold hover:bg-brand-gold hover:text-brand-navy transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-60"
                  >
                    {saving ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <>Save Address <ArrowRight size={16} /></>
                    )}
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
