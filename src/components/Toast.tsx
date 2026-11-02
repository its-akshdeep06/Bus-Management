'use client';

import React from 'react';
import { NotificationItem } from '@/types';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

interface ToastProps {
  notifications: NotificationItem[];
}

export const Toast: React.FC<ToastProps> = ({ notifications }) => {
  if (notifications.length === 0) return null;

  return (
    <div className="safar-toast-shelf">
      {notifications.map((notif) => (
        <div key={notif.id} className={`safar-toast-card ${notif.type || 'info'}`}>
          {notif.type === 'success' && <CheckCircle2 size={18} color="var(--success)" />}
          {notif.type === 'error' && <AlertCircle size={18} color="var(--alert)" />}
          {(!notif.type || notif.type === 'info') && <Info size={18} color="var(--muted-teal)" />}
          <span>{notif.message}</span>
        </div>
      ))}
    </div>
  );
};
