"use client";

import React from 'react';
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { DeleteAlertDialog } from "./DeleteAlertDialog";

interface PostDisplayProps {
  author: {
    id: string;
    username: string;
    image: string | null;
  };
  content: string;
  image?: string | null;
  createdAt: Date;
  currentUserId: string | null;
  onDelete: () => Promise<void>;
  isDeleting: boolean;
}

const PostDisplay = ({
  author,
  content,
  image,
  createdAt,
  currentUserId,
  onDelete,
  isDeleting
}: PostDisplayProps) => {
  return (
    <div className="flex px-4 space-x-4 p-2 hover:bg-gray-800">
      <Link href={`/profile/${author.username}`}>
        <div className="flex-shrink-0">
          <img
            src={author.image ?? "/avatar.png"}
            alt="Profile"
            className="w-12 h-12 mr-1 rounded-full"
          />
        </div>
      </Link>

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-yellow-500">@{author.username}</span>
            <span className="text-sm text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(createdAt))} ago
            </span>
          </div>

          {currentUserId === author.id && (
            <DeleteAlertDialog isDeleting={isDeleting} onDelete={onDelete} />
          )}
        </div>

        <div className="h-auto content-div p-4">
          <p>{content}</p>
        </div>
      </div>
    </div>
  );
};

export default PostDisplay;