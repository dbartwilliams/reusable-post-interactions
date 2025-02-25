"use server";

import prisma from "@/lib/prisma";
import { getDbUserId } from "./user.action";
import { revalidatePath } from "next/cache";


export async function getNotifications() {
  try {
    const userId = await getDbUserId();
    if (!userId) return [];

    const notifications = await prisma.notification.findMany({
      where: {
        userId,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        post: {
          select: {
            id: true,
            content: true,
            image: true,
          },
        },
        comment: {
          select: {
            id: true,
            content: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return notifications;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw new Error("Failed to fetch notifications");
  }
}

export async function markNotificationsAsRead(notificationIds: string[]) {
  try {
    await prisma.notification.updateMany({
      where: {
        id: {
          in: notificationIds,
        },
      },
      data: {
        read: true,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    return { success: false };
  }
}


export async function deleteNotification(notificationId: string) {
  try {
    const userId = await getDbUserId(); // Ensure this function is defined and returns the correct user ID

    // Fetch the notification to check ownership
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
      select: { userId: true }, // Ensure the field is `userId` or `authorId` depending on your schema
    });

    // Check if the notification exists
    if (!notification) throw new Error("Notification not found");

    // Check if the current user is authorized to delete the notification
    if (notification.userId !== userId) throw new Error("Unauthorized - no delete permission");

    // Delete the notification
    await prisma.notification.delete({
      where: { id: notificationId },
    });

    // Revalidate the cache to reflect the changes
    revalidatePath("/"); // Adjust the path as needed

    return { success: true };
  } catch (error) {
    console.error("Failed to delete notification:", error);
    return { success: false, error: "Failed to delete notification" };
  }
}