import React from 'react';
import { NotificationMessage } from '../types';
import { MessageSquare, Phone, CheckCircle2, X, Bell } from 'lucide-react';

interface NotificationToastContainerProps {
  notifications: NotificationMessage[];
  onDismiss: (id: string) => void;
  onViewOrder?: (orderId: string) => void;
}

export const NotificationToastContainer: React.FC<NotificationToastContainerProps> = ({
  notifications,
  onDismiss,
  onViewOrder,
}) => {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className="pointer-events-auto bg-zinc-900 text-white p-4 rounded-xl border border-zinc-700 shadow-2xl animate-in slide-in-from-bottom-5 duration-300 space-y-2"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                notif.type === 'whatsapp' ? 'bg-emerald-500 text-zinc-950' : 'bg-blue-500 text-white'
              }`}>
                {notif.type === 'whatsapp' ? (
                  <MessageSquare className="w-4 h-4" />
                ) : (
                  <Phone className="w-4 h-4" />
                )}
              </div>
              <div>
                <span className="text-xs font-bold block">{notif.title}</span>
                <span className="text-[10px] text-zinc-400 font-mono">
                  {notif.type.toUpperCase()} Alert • {notif.timestamp}
                </span>
              </div>
            </div>
            <button
              onClick={() => onDismiss(notif.id)}
              className="text-zinc-400 hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed font-mono">
            {notif.body}
          </p>

          {notif.orderId && onViewOrder && (
            <div className="pt-1 flex justify-end">
              <button
                onClick={() => {
                  onViewOrder(notif.orderId!);
                  onDismiss(notif.id);
                }}
                className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 hover:underline"
              >
                Track Live Fulfillment &rarr;
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
