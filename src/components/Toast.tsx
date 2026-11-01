'use client';

import React from 'react';
import { NotificationItem } from '@/types';

interface ToastProps {
  notifications: NotificationItem[];
}

export const Toast: React.FC<ToastProps> = ({ notifications }) => {
  if (notifications.length === 0) return null;

  return (
    <div className="notification-area">
      {notifications.map((notif) => (
        <div key={notif.id} className={`notification ${notif.type || 'info'}`}>
          <span>{notif.message}</span>
        </div>
      ))}
    </div>
  );
};

