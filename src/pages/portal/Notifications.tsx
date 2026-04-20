import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { 
  Bell, 
  Clock, 
  ChevronRight, 
  Trash2, 
  CheckCircle2, 
  Info, 
  AlertTriangle,
  Loader2,
  Inbox
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { NotificationService, AppNotification } from "../../services/notificationService";

export default function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      try {
        const data = await NotificationService.getNotifications(user.uid);
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [user]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await NotificationService.markAsRead(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'status_update': return <CheckCircle2 size={18} className="text-green-500" />;
      case 'promotion': return <Info size={18} className="text-brand-gold" />;
      case 'reminder': return <Clock size={18} className="text-blue-500" />;
      default: return <Bell size={18} className="text-brand-navy/40" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-brand-gold" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-serif text-brand-navy mb-2">Notifications</h1>
          <p className="text-brand-navy/40 text-[10px] uppercase tracking-[0.3em] font-bold">Stay updated on your curation</p>
        </div>
        {notifications.length > 0 && (
          <button className="text-[10px] uppercase tracking-widest font-bold text-brand-gold hover:text-brand-navy transition-colors">
            Mark all as read
          </button>
        )}
      </div>

      <div className="bg-white rounded-sm border border-brand-navy/5 shadow-sm overflow-hidden">
        {notifications.length > 0 ? (
          <div className="divide-y divide-brand-navy/5">
            {notifications.map((notif) => (
              <div 
                key={notif.id} 
                className={`p-6 flex gap-6 hover:bg-brand-navy/[0.02] transition-colors relative group ${!notif.isRead ? 'bg-brand-gold/[0.03]' : ''}`}
              >
                {!notif.isRead && (
                  <div className="absolute left-0 top-0 w-1 h-full bg-brand-gold" />
                )}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${!notif.isRead ? 'bg-white shadow-sm' : 'bg-brand-navy/5'}`}>
                  {getIcon(notif.type)}
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`text-sm font-bold ${!notif.isRead ? 'text-brand-navy' : 'text-brand-navy/70'}`}>
                      {notif.title}
                    </h3>
                    <span className="text-[9px] uppercase tracking-widest text-brand-navy/30 font-bold">
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-brand-navy/50 leading-relaxed mb-4">
                    {notif.message}
                  </p>
                  <div className="flex gap-4">
                    {!notif.isRead && (
                      <button 
                        onClick={() => handleMarkAsRead(notif.id)}
                        className="text-[9px] uppercase tracking-widest font-bold text-brand-gold hover:text-brand-navy transition-colors"
                      >
                        Mark as read
                      </button>
                    )}
                    <button className="text-[9px] uppercase tracking-widest font-bold text-brand-navy/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <div className="w-20 h-20 bg-brand-navy/5 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-navy/20">
              <Inbox size={40} />
            </div>
            <h3 className="text-xl font-serif text-brand-navy mb-2">Zero Notifications</h3>
            <p className="text-brand-navy/40 text-sm max-w-xs mx-auto">You're all caught up! When something important happens, we'll let you know here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
