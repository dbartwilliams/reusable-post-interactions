
import { getNotifications, markNotificationsAsRead } from "@/actions/notification.action";
import { Toast, ToastTitle, ToastDescription } from "./toast";

interface Notification {
  id: string;
  type: string;
  read: boolean;
  userId: string;
  creatorId: string;
  postId?: string;
  commentId?: string;
  createdAt: Date;
}

export async function NotifyUser() {
  try {
    const notifications = await getNotifications();
    
    if (!notifications.length) return;
    
    const unreadNotifications = notifications.filter((n: Notification) => !n.read);
    
    if (!unreadNotifications.length) return;
    
    return (
      <Toast>
        <ToastTitle>New Notifications</ToastTitle>
        <ToastDescription>
          You have {unreadNotifications.length} unread notifications
        </ToastDescription>
      </Toast>
    );
    
    const unreadIds = unreadNotifications.map((n: Notification) => n.id);
    await markNotificationsAsRead(unreadIds);
  } catch (error) {
    console.error("Error in NotifyUser:", error);
  }
}
