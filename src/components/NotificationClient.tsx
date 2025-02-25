'use client'; // Mark this component as client-side only

import { useEffect, useState } from 'react';
import { BellIcon } from 'lucide-react'; // Replace with your icon library
import Link from 'next/link';
import { Button } from '@/components/ui/button'; // Replace with your button component

export const NotificationClient = () => {
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      // Fetch notifications from your API or state
      const response = await fetch('/api/notifications');
      const data = await response.json();
      setNotificationCount(data.length);
    };

    fetchNotifications();
  }, []);

  return (
    <Button variant="ghost" className="flex items-center gap-2" asChild>
      <Link href="/notifications" className="relative">
        <BellIcon className="w-4 h-4" />
        <span className="hidden lg:inline">Notifications</span>
        {notificationCount > 0 && (
          <div className="absolute top-0 right-0 inline-block w-4 h-4 bg-red-500 text-white text-xs font-semibold flex p-4 rounded-full items-center justify-center">
            <span>{notificationCount > 9 ? '9+' : notificationCount}</span>
          </div>
        )}
      </Link>
    </Button>
  );
};