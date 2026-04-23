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
        {/* Floating Mobile Command Bar / Desktop Header */}
        <header className="bg-white/80 lg:bg-white border-b border-brand-navy/5 px-4 sm:px-8 py-5 sticky top-0 lg:top-0 z-30 flex items-center justify-between shadow-sm backdrop-blur-xl lg:backdrop-blur-md transition-all sm:mx-0 mx-2 mt-2 lg:mt-0 rounded-2xl lg:rounded-none border lg:border-0 lg:border-b border-brand-navy/5 lg:border-brand-navy/5">
          <div className="flex items-center gap-3 sm:gap-4 lg:hidden">
            <div className="flex flex-col ml-2">
              <Link to="/" className="text-lg font-serif font-bold text-brand-navy tracking-tighter leading-none italic uppercase">Coolzo</Link>
              <span className="text-[6px] uppercase tracking-[0.3em] font-black text-brand-gold mt-0.5">Systems v.2026</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-4 bg-brand-navy/5 px-4 py-2 rounded-sm flex-grow max-w-md">
            <Search size={16} className="text-brand-navy/30" />
            <input 
              type="text" 
              placeholder="Search SR#, equipment, or help..." 
              className="bg-transparent border-none outline-none text-sm text-brand-navy w-full font-medium"
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
            <button 
              onClick={handleLogout}
              className="hidden lg:flex items-center gap-3 p-2 text-brand-navy/60 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all group active:scale-95 border border-transparent hover:border-red-100"
            >
              <div className="flex flex-col items-end">
                <span className="text-[8px] font-black uppercase tracking-[0.2em] leading-none mb-0.5">Session</span>
                <span className="text-[10px] font-serif font-black italic leading-none">Terminate</span>
              </div>
              <LogOut size={18} className="stroke-[2] transition-transform group-hover:translate-x-0.5" />
            </button>
            <div className="flex items-center gap-2 lg:hidden">
              <Link to="/portal/profile" className="w-10 h-10 rounded-full bg-brand-navy flex items-center justify-center overflow-hidden border-2 border-white shadow-[0_4px_20px_rgba(2,12,27,0.15)] relative active:scale-90 transition-transform">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt={userName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <span className="text-white font-serif font-black italic text-xs">{user?.displayName?.[0] || 'U'}</span>
                )}
              </Link>
              <button 
                onClick={handleLogout}
                className="p-2 text-red-600/40 active:scale-90 transition-transform"
                title="Logout"
              >
                <LogOut size={18} className="stroke-[2.5]" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 sm:p-8 lg:p-12 pb-32 lg:pb-12 no-scrollbar">
          <Outlet />
        </div>

        {/* Mobile Bottom Navigation Matrix */}
        <nav className="lg:hidden fixed bottom-6 left-4 right-4 bg-brand-navy/95 backdrop-blur-2xl border border-white/10 px-4 py-5 flex justify-between items-center z-40 rounded-[2.5rem] shadow-[0_20px_50px_rgba(2,12,27,0.4)]">
          {navItems.slice(0, 4).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-2 flex-1 transition-all duration-500 ${ 
                location.pathname === item.path ? "text-brand-gold" : "text-white/30"
              }`}
            >
              <div className={`p-2 rounded-2xl transition-all duration-500 relative ${location.pathname === item.path ? "bg-white/5 scale-110 -translate-y-1 shadow-[0_0_20px_rgba(206,164,98,0.2)]" : "active:scale-90"}`}>
                {item.icon}
                {location.pathname === item.path && (
                  <motion.div layoutId="nav-glow" className="absolute -inset-1 bg-brand-gold/10 blur-xl rounded-full" />
                )}
              </div>
              <span className={`text-[7px] uppercase tracking-[0.2em] font-black text-center transition-opacity duration-500 ${location.pathname === item.path ? "opacity-100" : "opacity-40"}`}>
                {item.name.split(' ')[0]}
              </span>
            </Link>
          ))}
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
              <div className="flex justify-between items-center mb-16">
                <div>
                  <span className="text-3xl font-serif font-bold text-white italic uppercase tracking-tighter">Coolzo</span>
                  <p className="text-brand-gold text-[7px] uppercase tracking-[0.5em] font-black mt-2">Executive Access Level</p>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-2xl text-white/40 active:scale-90 transition-transform">
                  <X size={24} className="stroke-[1.5]" />
                </button>
              </div>
              <nav className="flex-grow space-y-8 overflow-y-auto no-scrollbar pr-2">
                <div>
                  <p className="text-[8px] uppercase tracking-[0.3em] font-black text-brand-gold/60 mb-6 border-l-2 border-brand-gold pl-4">System Directives</p>
                  <div className="space-y-4">
                    {navItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-6 py-4 px-5 rounded-2xl text-[10px] uppercase tracking-[0.3em] font-black transition-all ${ 
                          location.pathname === item.path ? "bg-white/10 text-brand-gold translate-x-2 shadow-xl" : "text-white/40 hover:text-white"
                        }`}
                      >
                        <div className={`${location.pathname === item.path ? "text-brand-gold" : "text-white/20"}`}>
                          {item.icon}
                        </div>
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
                
                <div className="pt-10">
                  <p className="text-[8px] uppercase tracking-[0.3em] font-black text-brand-gold/60 mb-6 border-l-2 border-brand-gold pl-4">Identity Parameters</p>
                  <div className="space-y-4">
                    {accountItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-6 py-4 px-5 rounded-2xl text-[10px] uppercase tracking-[0.3em] font-black transition-all ${ 
                          location.pathname === item.path ? "bg-white/10 text-brand-gold translate-x-2 shadow-xl" : "text-white/40 hover:text-white"
                        }`}
                      >
                        <div className={`${location.pathname === item.path ? "text-brand-gold" : "text-white/20"}`}>
                          {item.icon}
                        </div>
                        {item.name === "Profile" ? "Identity" : item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </nav>
              <div className="pt-10 border-t border-white/10 mt-auto">
                <div className="flex items-center gap-4 mb-10 bg-white/5 p-5 rounded-[2.5rem] border border-white/5">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-brand-gold flex items-center justify-center text-brand-navy font-serif italic text-2xl shadow-[0_0_20px_rgba(206,164,98,0.3)]">
                      {userInitial}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-brand-navy rounded-full" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[9px] uppercase tracking-[0.2em] font-black text-white/40 mb-1">Access Verified</p>
                    <p className="text-base font-bold text-white truncate uppercase tracking-tighter">{userName}</p>
                  </div>
                </div>
                <button onClick={handleLogout} className="w-full flex items-center justify-center gap-4 py-5 bg-red-600 text-white rounded-3xl text-[9px] uppercase tracking-[0.4em] font-black transition-all active:scale-95 shadow-2xl shadow-red-600/20">
                  <LogOut size={18} className="stroke-[2]" /> Terminate Session
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
