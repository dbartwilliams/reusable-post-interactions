
"use client";

import React from 'react';
import { formatDistanceToNow } from "date-fns";
import { Trash2 } from "lucide-react";

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  author: {
    name: string | null;
    username: string;
    image: string | null;
  };
}

interface CommentSectionProps {
  comments: Comment[];
  showComments: boolean;
}

const CommentSection = ({ comments, showComments }: CommentSectionProps) => {
  if (!showComments) return null;

  return (
    <div className="space-y-4 bg-gray-800">
      {comments.map((comment) => (
        <div key={comment.id} className="flex p-3 space-x-3">
          <div className="flex-shrink-0 size-8">
            <img 
              src={comment.author.image ?? "/avatar.png"} 
              alt="comment"
              className="w-8 h-8 mr-1 rounded-full"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="text-sm font-medium">{comment.author.name}</span>
              <span className="text-sm text-muted-foreground">
                @{comment.author.username}
              </span>
              <span className="text-sm text-muted-foreground">·</span>
              <span className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(comment.createdAt))} ago
              </span>
            </div>
            <Trash2 className="size-4 ml-auto mr-3 text-yellow-800 hover:text-yellow-600" />
            <p className="pt-1 pl-2 text-sm break-words">{comment.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentSection;


