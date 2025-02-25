
import { getNotifications, markNotificationsAsRead } from "@/actions/notification.action";
import { toast } from "./ui/use-toast";

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
    
    toast({
      title: "New Notifications",
      description: `You have ${unreadNotifications.length} unread notifications`,
    });
    
    const unreadIds = unreadNotifications.map((n: Notification) => n.id);
    await markNotificationsAsRead(unreadIds);
  } catch (error) {
    console.error("Error in NotifyUser:", error);
  }
}
