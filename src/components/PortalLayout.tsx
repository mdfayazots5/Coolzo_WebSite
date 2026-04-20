import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { 
  Home, 
  Calendar, 
  ShieldCheck, 
  Smartphone, 
  LogOut, 
  User as UserIcon, 
  Bell, 
  Search,
  Menu,
  X,
  Plus,
  FileText,
  HelpCircle,
  MapPin,
  RotateCcw
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../contexts/AuthContext";

import { apiConfig } from "../config/apiConfig";

export default function PortalLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  const navItems = [
    { name: "Dashboard", path: "/portal", icon: <Home size={20} /> },
    { name: "My Bookings", path: "/portal/bookings", icon: <Calendar size={20} /> },
    { name: "AMC Dashboard", path: "/portal/amc", icon: <ShieldCheck size={20} /> },
    { name: "My Equipment", path: "/portal/equipment", icon: <Smartphone size={20} /> },
    { name: "My Invoices", path: "/portal/invoices", icon: <FileText size={20} /> },
    { name: "Support Tickets", path: "/portal/support", icon: <HelpCircle size={20} /> },
  ];

  const accountItems = [
    { name: "Profile", path: "/portal/profile", icon: <UserIcon size={18} /> },
    { name: "Addresses", path: "/portal/addresses", icon: <MapPin size={18} /> },
    { name: "Notifications", path: "/portal/notifications", icon: <Bell size={18} /> },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const userInitial = user?.displayName ? user.displayName.charAt(0) : (user?.email ? user.email.charAt(0).toUpperCase() : "U");
  const userName = user?.displayName || user?.email?.split('@')[0] || "User";

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-brand-navy text-white sticky top-0 h-screen border-r border-white/5">
        <div className="p-8 border-b border-white/5">
          <Link to="/" className="text-2xl font-serif font-bold tracking-tighter text-white block">Coolzo</Link>
          <p className="text-brand-gold text-[8px] uppercase tracking-[0.4em] font-bold mt-1">Professional Portal</p>
        </div>

        <nav className="flex-grow p-6 space-y-2 overflow-y-auto">
          <div className="mb-6">
            <p className="text-[9px] uppercase tracking-widest text-white/20 font-bold px-6 mb-4">Main Menu</p>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-6 py-4 rounded-sm text-[10px] uppercase tracking-widest font-bold transition-all ${
                  location.pathname === item.path 
                    ? "bg-brand-gold text-brand-navy shadow-lg" 
                    : "text-white/40 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </div>

          <div>
            <p className="text-[9px] uppercase tracking-widest text-white/20 font-bold px-6 mb-4">Account Settings</p>
            {accountItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-6 py-3 rounded-sm text-[10px] uppercase tracking-widest font-bold transition-all ${
                  location.pathname === item.path 
                    ? "bg-brand-gold text-brand-navy shadow-lg" 
                    : "text-white/40 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </div>
        </nav>

        <div className="p-6 border-t border-white/5 space-y-4">
          <div className="flex items-center gap-4 px-6 py-4">
            {user?.photoURL ? (
              <img src={user.photoURL} alt={userName} className="w-10 h-10 rounded-full object-cover border border-white/10" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-brand-gold flex items-center justify-center text-brand-navy font-serif italic">{userInitial}</div>
            )}
            <div>
              <p className="text-xs font-bold truncate max-w-[140px]">{userName}</p>
              <p className="text-[9px] uppercase tracking-widest text-white/40">Trusted Member</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-6 py-4 text-white/40 hover:text-red-400 text-[10px] uppercase tracking-widest font-bold transition-colors"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-brand-navy/5 px-8 py-4 sticky top-0 z-30 flex items-center justify-between">
          <div className="flex items-center gap-4 lg:hidden">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-brand-navy">
              <Menu size={24} />
            </button>
            <Link to="/" className="text-xl font-serif font-bold text-brand-navy">Coolzo</Link>
          </div>

          <div className="hidden md:flex items-center gap-4 bg-brand-navy/5 px-4 py-2 rounded-sm flex-grow max-w-md">
            <Search size={16} className="text-brand-navy/30" />
            <input 
              type="text" 
              placeholder="Search SR#, equipment, or help..." 
              className="bg-transparent border-none outline-none text-sm text-brand-navy w-full"
            />
          </div>

          <div className="flex items-center gap-6">
            {apiConfig.IS_MOCK && (
              <div className="hidden lg:flex items-center gap-4 border-r border-brand-navy/5 pr-6">
                <div className="flex items-center gap-2 px-3 py-1 bg-brand-gold/10 border border-brand-gold/20 rounded-full">
                  <div className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-pulse" />
                  <span className="text-[8px] uppercase tracking-widest font-bold text-brand-navy/60 italic">Demo Environment</span>
                </div>
                <button 
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className={`text-brand-navy/30 hover:text-brand-navy transition-colors ${isRefreshing ? 'animate-spin' : ''}`}
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            )}
            <button className="relative p-2 text-brand-navy/40 hover:text-brand-navy transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-brand-gold rounded-full border-2 border-white" />
            </button>
            <Link to="/book" className="hidden sm:flex items-center gap-2 bg-brand-navy text-white px-6 py-2 rounded-sm text-[10px] uppercase tracking-widest font-bold hover:bg-brand-gold hover:text-brand-navy transition-all shadow-md">
              <Plus size={14} /> Book Service
            </Link>
            <Link to="/portal/profile" className="w-8 h-8 rounded-full bg-brand-navy/5 flex items-center justify-center lg:hidden overflow-hidden">
              {user?.photoURL ? (
                <img src={user.photoURL} alt={userName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <UserIcon size={18} className="text-brand-navy" />
              )}
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 lg:p-12">
          <Outlet />
        </div>

        {/* Mobile Bottom Tab Bar */}
        <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-brand-navy/5 px-6 py-3 flex justify-between items-center z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 transition-colors ${
                location.pathname === item.path ? "text-brand-gold" : "text-brand-navy/40"
              }`}
            >
              {item.icon}
              <span className="text-[8px] uppercase tracking-widest font-bold">{item.name.split(' ')[0]}</span>
            </Link>
          ))}
          <button onClick={handleLogout} className="flex flex-col items-center gap-1 text-brand-navy/40">
            <LogOut size={20} />
            <span className="text-[8px] uppercase tracking-widest font-bold">Exit</span>
          </button>
        </nav>
      </main>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-brand-navy/60 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              className="fixed top-0 left-0 h-full w-72 bg-brand-navy text-white z-[60] lg:hidden p-8 flex flex-col"
            >
              <div className="flex justify-between items-center mb-12">
                <span className="text-2xl font-serif font-bold">Coolzo</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-white/40">
                  <X size={24} />
                </button>
              </div>
              <nav className="flex-grow space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-4 py-4 text-[10px] uppercase tracking-widest font-bold ${
                      location.pathname === item.path ? "text-brand-gold" : "text-white/40"
                    }`}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}
              </nav>
              <div className="pt-8 border-t border-white/5">
                <button onClick={handleLogout} className="flex items-center gap-4 text-white/40 text-[10px] uppercase tracking-widest font-bold">
                  <LogOut size={20} /> Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
