
"use client";

import React from 'react';
import { formatDistanceToNow } from "date-fns";
import { Trash2, Heart } from "lucide-react";
import toast from "react-hot-toast";
import { deleteComment, toggleCommentLike } from "../actions/comment.action";

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
  currentUserId: string | null;
}

const CommentSection = ({ comments, showComments, currentUserId }: CommentSectionProps) => {
  const [isDeletingMap, setIsDeletingMap] = React.useState<Record<string, boolean>>({});
  const [isLikingMap, setIsLikingMap] = React.useState<Record<string, boolean>>({});

  if (!showComments) return null;

  const handleDeleteComment = async (commentId: string) => {
    if (isDeletingMap[commentId]) return;
    
    try {
      setIsDeletingMap(prev => ({ ...prev, [commentId]: true }));
      const result = await deleteComment(commentId);
      if (result.success) {
        toast.success("Comment deleted successfully");
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error("Failed to delete comment");
    } finally {
      setIsDeletingMap(prev => ({ ...prev, [commentId]: false }));
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (isLikingMap[commentId]) return;
    
    try {
      setIsLikingMap(prev => ({ ...prev, [commentId]: true }));
      await toggleCommentLike(commentId);
    } catch (error) {
      toast.error("Failed to like comment");
    } finally {
      setIsLikingMap(prev => ({ ...prev, [commentId]: false }));
    }
  };

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
            <div className="flex justify-between items-start">
              <p className="pt-1 pl-2 text-sm break-words">{comment.content}</p>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleLikeComment(comment.id)}
                  disabled={isLikingMap[comment.id]}
                  className="text-muted-foreground hover:text-pink-500"
                >
                  <Heart className="size-4" />
                </button>
                {currentUserId === comment.author.id && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    disabled={isDeletingMap[comment.id]}
                    className="text-muted-foreground hover:text-red-500"
                  >
                    <Trash2 className="size-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentSection;
