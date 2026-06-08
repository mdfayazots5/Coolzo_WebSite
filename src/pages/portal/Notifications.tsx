import { useEffect, useState, useCallback } from "react";
import { motion } from "motion/react";
import {
  Bell,
  Clock,
  CheckCircle2,
  Info,
  Loader2,
  Inbox,
} from "lucide-react";
import { NotificationService } from "../../services/notificationService";
import type { CustomerNotificationResponse } from "../../types/notification";

function getIcon(type: string) {
  switch (type) {
    case 'status_update': return <CheckCircle2 size={18} className="text-green-500" />;
    case 'promotion': return <Info size={18} className="text-brand-gold" />;
    case 'reminder': return <Clock size={18} className="text-blue-500" />;
    default: return <Bell size={18} className="text-brand-navy/40" />;
  }
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<CustomerNotificationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);

  const loadNotifications = useCallback(async () => {
    try {
      const data = await NotificationService.getNotifications(1, 20);
      setNotifications(data ?? []);
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadNotifications(); }, []);

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await NotificationService.markRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => n.notificationId === notificationId ? { ...n, isRead: true } : n),
      );
    } catch {
      /* silent */
    }
  };

  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    try {
      await NotificationService.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {
      /* silent */
    } finally {
      setMarkingAll(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-brand-gold" size={40} />
      </div>
    );
  }

  const hasUnread = notifications.some((n) => !n.isRead);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8 lg:mb-12">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif text-brand-navy mb-2 grayscale-0">Notifications</h1>
          <p className="text-brand-navy/40 text-[10px] uppercase tracking-[0.3em] font-bold">
            Stay updated on your curation
          </p>
        </div>
        {hasUnread && (
          <button
            onClick={handleMarkAllRead}
            disabled={markingAll}
            className="w-full sm:w-auto text-[10px] uppercase tracking-widest font-bold text-brand-gold hover:text-brand-navy transition-colors text-left sm:text-right disabled:opacity-50"
          >
            {markingAll ? 'Marking...' : 'Mark all as read'}
          </button>
        )}
      </div>

      <div className="bg-white rounded-sm border border-brand-navy/5 shadow-sm overflow-hidden">
        {notifications.length > 0 ? (
          <div className="divide-y divide-brand-navy/5">
            {notifications.map((notif) => (
              <motion.div
                key={notif.notificationId}
                layout
                className={`p-6 sm:p-8 flex gap-4 sm:gap-6 hover:bg-brand-navy/[0.02] transition-colors relative group ${
                  !notif.isRead ? 'bg-brand-gold/[0.03]' : ''
                }`}
              >
                {!notif.isRead && (
                  <div className="absolute left-0 top-0 w-1 h-full bg-brand-gold" />
                )}
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 ${
                  !notif.isRead ? 'bg-white shadow-sm' : 'bg-brand-navy/5'
                }`}>
                  {getIcon(notif.notificationType)}
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-2 sm:mb-1 gap-1 sm:gap-4">
                    <h3 className={`text-sm font-bold truncate pr-4 ${
                      !notif.isRead ? 'text-brand-navy' : 'text-brand-navy/70'
                    }`}>
                      {notif.title}
                    </h3>
                    <span className="text-[9px] uppercase tracking-widest text-brand-navy/30 font-bold whitespace-nowrap">
                      {new Date(notif.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-brand-navy/50 leading-relaxed mb-4">{notif.message}</p>
                  <div className="flex items-center gap-6">
                    {!notif.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(notif.notificationId)}
                        className="text-[9px] uppercase tracking-widest font-bold text-brand-gold hover:text-brand-navy transition-colors"
                      >
                        Mark as read
                      </button>
                    )}
                    {notif.actionUrl && (
                      <a
                        href={notif.actionUrl}
                        className="text-[9px] uppercase tracking-widest font-bold text-brand-navy/40 hover:text-brand-gold transition-colors"
                      >
                        View →
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <div className="w-20 h-20 bg-brand-navy/5 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-navy/20">
              <Inbox size={40} />
            </div>
            <h3 className="text-xl font-serif text-brand-navy mb-2">Zero Notifications</h3>
            <p className="text-brand-navy/40 text-sm max-w-xs mx-auto">
              You're all caught up! When something important happens, we'll let you know here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
