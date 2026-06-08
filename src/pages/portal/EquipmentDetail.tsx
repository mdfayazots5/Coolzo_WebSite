import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft,
  ShieldCheck,
  Clock,
  ArrowRight,
  Settings,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Trash2,
  X,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { EquipmentService } from "../../services/equipmentService";
import type { CustomerEquipmentResponse, UpdateCustomerEquipmentRequest } from "../../types/equipment";

function formatDate(dateStr?: string): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function installYear(purchaseDate?: string): string {
  if (!purchaseDate) return "—";
  return String(new Date(purchaseDate).getFullYear());
}

interface EditForm {
  name: string;
  type: string;
  brand: string;
  capacity: string;
  location: string;
  serialNumber: string;
}

export default function EquipmentDetail() {
  const { id } = useParams<{ id: string }>();
  const equipmentId = Number(id);
  const navigate = useNavigate();

  const [equipment, setEquipment] = useState<CustomerEquipmentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState<EditForm>({
    name: "", type: "", brand: "", capacity: "", location: "", serialNumber: "",
  });
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadEquipment = useCallback(async () => {
    try {
      // Try dedicated endpoint first (Phase 6); fall back to list + filter
      let data: CustomerEquipmentResponse | undefined;
      try {
        data = await EquipmentService.getEquipmentById(equipmentId);
      } catch {
        const list = await EquipmentService.getMyEquipment();
        data = list.find((eq) => eq.equipmentId === equipmentId);
      }
      setEquipment(data ?? null);
    } catch {
      setEquipment(null);
    } finally {
      setLoading(false);
    }
  }, [equipmentId]);

  useEffect(() => { loadEquipment(); }, [loadEquipment]);

  const openEdit = (eq: CustomerEquipmentResponse) => {
    setEditForm({
      name: eq.name,
      type: eq.type,
      brand: eq.brand,
      capacity: eq.capacity,
      location: eq.location ?? "",
      serialNumber: eq.serialNumber ?? "",
    });
    setShowEdit(true);
  };

  const handleSave = async () => {
    if (!equipment) return;
    setSaving(true);
    try {
      const payload: UpdateCustomerEquipmentRequest = {
        name: editForm.name,
        type: editForm.type,
        brand: editForm.brand,
        capacity: editForm.capacity,
        location: editForm.location || undefined,
        serialNumber: editForm.serialNumber || undefined,
      };
      const updated = await EquipmentService.updateEquipment(equipmentId, payload);
      setEquipment(updated);
      setShowEdit(false);
    } catch {
      /* silent — user can retry */
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await EquipmentService.deleteEquipment(equipmentId);
      navigate("/portal/equipment");
    } catch {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-brand-gold" size={40} />
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="max-w-5xl mx-auto text-center py-24">
        <AlertCircle size={40} className="text-brand-navy/20 mx-auto mb-4" />
        <p className="text-brand-navy/40 text-sm">Equipment not found.</p>
        <Link
          to="/portal/equipment"
          className="mt-6 inline-block text-[10px] uppercase tracking-widest font-bold text-brand-gold hover:text-brand-navy transition-colors"
        >
          Back to Equipment
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Edit Modal */}
      <AnimatePresence>
        {showEdit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-navy/60 backdrop-blur-sm"
            onClick={() => setShowEdit(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white p-8 sm:p-10 rounded-sm shadow-2xl w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-serif text-brand-navy">Edit Equipment</h3>
                <button onClick={() => setShowEdit(false)} className="text-brand-navy/20 hover:text-brand-navy transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-6">
                {([
                  { label: "Model / Name", key: "name", placeholder: "e.g. WindFree Pro" },
                  { label: "Brand", key: "brand", placeholder: "e.g. Samsung" },
                  { label: "Type", key: "type", placeholder: "e.g. Split, Window" },
                  { label: "Capacity", key: "capacity", placeholder: "e.g. 1.5 Ton" },
                  { label: "Location", key: "location", placeholder: "e.g. Living Room" },
                  { label: "Serial Number", key: "serialNumber", placeholder: "e.g. SN-99281-CZ" },
                ] as { label: string; key: keyof EditForm; placeholder: string }[]).map((field) => (
                  <div key={field.key} className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">{field.label}</label>
                    <input
                      type="text"
                      value={editForm[field.key]}
                      placeholder={field.placeholder}
                      onChange={(e) => setEditForm((f) => ({ ...f, [field.key]: e.target.value }))}
                      className="w-full bg-brand-navy/5 border border-transparent rounded-sm px-4 py-3 text-sm text-brand-navy focus:outline-none focus:border-brand-gold transition-colors"
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setShowEdit(false)}
                  className="flex-1 py-4 border border-brand-navy/10 rounded-sm text-[10px] uppercase tracking-widest font-bold text-brand-navy/40 hover:text-brand-navy transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !editForm.name.trim()}
                  className="flex-1 bg-brand-navy text-white py-4 rounded-sm text-[10px] uppercase tracking-widest font-bold hover:bg-brand-gold hover:text-brand-navy transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : "Save Changes"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-navy/60 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white p-8 sm:p-10 rounded-sm shadow-2xl w-full max-w-sm text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Trash2 size={40} className="text-red-400 mx-auto mb-6" />
              <h3 className="text-xl font-serif text-brand-navy mb-3">Remove Equipment?</h3>
              <p className="text-sm text-brand-navy/50 mb-8 leading-relaxed">
                This will permanently remove <strong>{equipment.brand} {equipment.name}</strong> from your equipment list.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-4 border border-brand-navy/10 rounded-sm text-[10px] uppercase tracking-widest font-bold text-brand-navy/40 hover:text-brand-navy transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 bg-red-500 text-white py-4 rounded-sm text-[10px] uppercase tracking-widest font-bold hover:bg-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deleting ? <Loader2 size={14} className="animate-spin" /> : "Remove"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <Link
          to="/portal/equipment"
          className="flex items-center gap-2 text-brand-navy/40 hover:text-brand-navy text-[10px] uppercase tracking-widest font-bold transition-colors"
        >
          <ChevronLeft size={14} /> Back to Equipment
        </Link>
        <div className="flex gap-3">
          <button
            onClick={() => openEdit(equipment)}
            className="flex items-center gap-2 px-5 py-2 border border-brand-navy/10 rounded-sm text-[9px] uppercase tracking-widest font-bold text-brand-navy hover:bg-brand-navy hover:text-white transition-all"
          >
            <Settings size={14} /> Edit Details
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 border border-red-100 rounded-sm text-red-400 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Equipment Identity */}
      <div className="bg-white p-6 sm:p-10 md:p-12 rounded-sm border border-brand-navy/5 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
            <div className="w-20 h-20 bg-brand-navy text-white rounded-sm flex items-center justify-center text-4xl font-serif grayscale-0 shrink-0">
              {equipment.brand[0]}
            </div>
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-4 mb-3">
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-gold">
                  EQ-{equipment.equipmentId}
                </span>
                <span className="bg-brand-navy/5 text-brand-navy/40 px-3 py-1 rounded-full text-[8px] uppercase tracking-widest font-bold">
                  {equipment.type}
                </span>
                {!equipment.isActive && (
                  <span className="bg-red-50 text-red-400 px-3 py-1 rounded-full text-[8px] uppercase tracking-widest font-bold">
                    Inactive
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif text-brand-navy mb-1">
                {equipment.brand} {equipment.name}
              </h1>
              <p className="text-sm text-brand-navy/40">
                {equipment.location ?? "No location set"} •{" "}
                {equipment.purchaseDate ? `Installed ${installYear(equipment.purchaseDate)}` : "Install year not set"}
              </p>
            </div>
          </div>
          <Link
            to="/book"
            className="w-full md:w-auto text-center bg-brand-gold text-brand-navy px-10 py-4 rounded-sm text-[10px] uppercase tracking-widest font-bold hover:bg-brand-navy hover:text-white transition-all shadow-xl"
          >
            Book Service
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mt-12 pt-12 border-t border-brand-navy/5">
          <div>
            <p className="text-[9px] uppercase tracking-widest font-bold text-brand-navy/40 mb-1">Capacity</p>
            <p className="text-sm font-bold text-brand-navy">{equipment.capacity || "—"}</p>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-widest font-bold text-brand-navy/40 mb-1">Serial Number</p>
            <p className="text-sm font-bold text-brand-navy">{equipment.serialNumber ?? "—"}</p>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-widest font-bold text-brand-navy/40 mb-1">Location Label</p>
            <p className="text-sm font-bold text-brand-navy">{equipment.location ?? "—"}</p>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-widest font-bold text-brand-navy/40 mb-1">Last Service</p>
            <p className="text-sm font-bold text-brand-navy">{formatDate(equipment.lastServiceDate)}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* History Column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 sm:p-8 rounded-sm border border-brand-navy/5 shadow-sm">
            <h3 className="text-xl font-serif text-brand-navy mb-8">Service History Timeline</h3>
            {/* Service history not available from equipment endpoint — link to bookings */}
            <div className="py-12 text-center">
              <Clock size={40} className="text-brand-navy/10 mx-auto mb-4" />
              <p className="text-brand-navy/40 text-sm mb-6">
                Service history is tracked in your bookings.
              </p>
              <Link
                to="/portal/bookings"
                className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-brand-gold hover:text-brand-navy transition-colors"
              >
                View All Bookings <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>

        {/* Warranty & Health Column */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-sm border border-brand-navy/5 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <ShieldCheck className="text-brand-gold" size={24} />
              <h3 className="text-lg font-serif text-brand-navy">Warranty Status</h3>
            </div>
            <div className="py-8 text-center">
              <CheckCircle2 size={32} className="text-brand-navy/10 mx-auto mb-3" />
              <p className="text-xs text-brand-navy/40 leading-relaxed mb-4">
                {equipment.purchaseDate
                  ? `Purchased ${formatDate(equipment.purchaseDate)}. Register your warranty to track coverage.`
                  : "Add your purchase date to check warranty coverage."}
              </p>
              <button
                onClick={() => openEdit(equipment)}
                className="text-[9px] uppercase tracking-widest font-bold text-brand-gold hover:text-brand-navy transition-colors"
              >
                {equipment.purchaseDate ? "Update Details" : "Add Purchase Date →"}
              </button>
            </div>
          </div>

          <div className="bg-brand-navy p-8 rounded-sm text-white">
            <h4 className="text-sm font-bold mb-4">System Health</h4>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full border-4 border-brand-gold flex items-center justify-center text-brand-gold font-serif">
                A+
              </div>
              <p className="text-xs text-white/40 leading-relaxed">
                Your system is operating at peak efficiency based on the last diagnostic.
              </p>
            </div>
            <Link
              to="/book"
              className="text-[9px] uppercase tracking-widest font-bold text-brand-gold hover:text-white transition-colors flex items-center gap-2"
            >
              Schedule Health Check <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
