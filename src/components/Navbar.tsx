import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, User, Menu, X, LayoutDashboard, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../contexts/AuthContext";
import { NotificationService, AppNotification } from "../services/notificationService";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (user) {
      const fetchNotifications = async () => {
        const data = await NotificationService.getNotifications(user.uid);
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.isRead).length);
      };
      fetchNotifications();

      // Subscribe to real-time updates
      const unsubscribe = NotificationService.subscribeToNotifications(user.uid, (newNotif) => {
        setNotifications(prev => [newNotif, ...prev]);
        setUnreadCount(prev => prev + 1);
      });
      return () => unsubscribe();
    }
  }, [user]);

  const navLinks = [
    { name: "Services", path: "/services" },
    { name: "AMC Plans", path: "/amc" },
    { name: "Why Coolzo", path: "/why-coolzo" },
    { name: "Reviews", path: "/reviews" },
    { name: "Blog", path: "/blog" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled || isOpen ? "bg-brand-cream/95 backdrop-blur-md py-3 shadow-md" : "bg-transparent py-6"}`}>
      <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <span className={`text-xl sm:text-2xl font-serif font-bold tracking-tighter transition-colors duration-500 ${scrolled || isOpen || location.pathname !== "/" ? "text-brand-navy" : "text-white"}`}>
            Coolzo
          </span>
        </Link>
        
        <div className="hidden lg:flex items-center gap-8 text-[10px] uppercase tracking-[0.2em] font-bold">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              className={`transition-colors duration-500 hover:text-brand-gold ${scrolled || location.pathname !== "/" ? "text-brand-navy/70" : "text-white/70"}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="relative group/notif">
            <button className={`p-2 rounded-full transition-colors duration-500 relative ${scrolled || isOpen || location.pathname !== "/" ? "hover:bg-brand-navy/5 text-brand-navy" : "hover:bg-white/10 text-white"}`}>
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-gold rounded-full border-2 border-brand-cream" />
              )}
            </button>
          </div>
          <button className={`p-2 rounded-full transition-colors duration-500 hidden sm:block ${scrolled || isOpen || location.pathname !== "/" ? "hover:bg-brand-navy/5 text-brand-navy" : "hover:bg-white/10 text-white"}`}>
            <ShoppingBag size={18} />
          </button>
          <Link to={user ? "/portal" : "/portal/profile"} className={`p-2 rounded-full transition-colors duration-500 ${scrolled || isOpen || location.pathname !== "/" ? "hover:bg-brand-navy/5 text-brand-navy" : "hover:bg-white/10 text-white"}`}>
            <User size={18} />
          </Link>
          <Link 
            to={user ? "/portal" : "/login"}
            className={`hidden md:flex items-center gap-2 px-6 py-2 rounded-sm text-[10px] uppercase tracking-widest font-bold transition-all duration-500 ${scrolled || isOpen || location.pathname !== "/" ? "bg-brand-navy text-white hover:bg-brand-navy/90" : "bg-white text-brand-navy hover:bg-brand-gold hover:text-white"}`}
          >
            {user ? (
              <><LayoutDashboard size={14} /> Portal</>
            ) : (
              "Login"
            )}
          </Link>
          <button 
            className="lg:hidden p-2 ml-1"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X size={24} className={scrolled || isOpen || location.pathname !== "/" ? "text-brand-navy" : "text-white"} />
            ) : (
              <Menu size={24} className={scrolled || isOpen || location.pathname !== "/" ? "text-brand-navy" : "text-white"} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute top-full left-0 w-full bg-brand-cream/95 backdrop-blur-md border-b border-brand-navy/5 p-6 flex flex-col gap-6 shadow-xl max-h-[80vh] overflow-y-auto"
          >
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                onClick={() => setIsOpen(false)}
                className="text-xs uppercase tracking-widest font-bold text-brand-navy hover:text-brand-gold transition-colors"
              >
                {link.name}
              </Link>
            ))}
              <Link 
                to={user ? "/portal" : "/login"}
                onClick={() => setIsOpen(false)}
                className="bg-brand-navy text-white px-6 py-4 rounded-sm text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2"
              >
                {user ? <><LayoutDashboard size={14} /> My Portal</> : "Sign In"}
              </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
