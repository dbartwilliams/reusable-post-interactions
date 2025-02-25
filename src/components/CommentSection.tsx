
"use client";

import React, { useState } from 'react';
import { formatDistanceToNow } from "date-fns";
import { HeartIcon, Trash2Icon } from "lucide-react";
import toast from "react-hot-toast";
import { deleteComment, toggleCommentLike } from "../actions/comment.action";

interface CommentAuthor {
  id: string;
  name: string | null;
  username: string;
  image: string | null;
}

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  author: CommentAuthor;
  likes: { userId: string }[];
  _count: {
    likes: number;
  };
}

interface CommentSectionProps {
  comments: Comment[];
  showComments: boolean;
  currentUserId: string | null;
}

const CommentSection = ({ comments, showComments, currentUserId }: CommentSectionProps) => {
  const [isDeletingMap, setIsDeletingMap] = useState<Record<string, boolean>>({});
  const [isLikingMap, setIsLikingMap] = useState<Record<string, boolean>>({});
  const [optimisticLikes, setOptimisticLikes] = useState<Record<string, number>>(() => {
    return comments.reduce((acc, comment) => ({
      ...acc,
      [comment.id]: comment._count?.likes ?? 0
    }), {});
  });

  const [hasLikedMap, setHasLikedMap] = useState<Record<string, boolean>>(() => {
    return comments.reduce((acc, comment) => ({
      ...acc,
      [comment.id]: comment.likes?.some(like => like.userId === currentUserId) ?? false
    }), {});
  });

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
    if (isLikingMap[commentId] || !currentUserId) return;
    
    try {
      setIsLikingMap(prev => ({ ...prev, [commentId]: true }));
      setHasLikedMap(prev => ({ ...prev, [commentId]: !prev[commentId] }));
      setOptimisticLikes(prev => ({
        ...prev,
        [commentId]: prev[commentId] + (hasLikedMap[commentId] ? -1 : 1)
      }));
      
      await toggleCommentLike(commentId);
    } catch (error) {
      // Revert optimistic updates on error
      setHasLikedMap(prev => ({ ...prev, [commentId]: !prev[commentId] }));
      setOptimisticLikes(prev => ({
        ...prev,
        [commentId]: prev[commentId] + (hasLikedMap[commentId] ? 1 : -1)
      }));
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
              alt="comment author"
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
            <p className="pt-1 pl-2 text-sm break-words">{comment.content}</p>
            
            {/* Comment Actions */}
            <div className="flex items-center gap-4 mt-2 px-2">
              <button
                onClick={() => handleLikeComment(comment.id)}
                disabled={isLikingMap[comment.id]}
                className={`text-muted-foreground gap-2 flex items-center ${
                  hasLikedMap[comment.id] ? "text-pink-500 hover:text-pink-600" : "hover:text-pink-500"
                }`}
              >
                <HeartIcon 
                  className={`w-4 h-4 ${hasLikedMap[comment.id] ? "fill-current text-pink-500" : ""}`}
                />
                <span>{optimisticLikes[comment.id]}</span>
              </button>

              {currentUserId === comment.author.id && (
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  disabled={isDeletingMap[comment.id]}
                  className="flex items-center gap-2 text-muted-foreground hover:text-red-500"
                >
                  <Trash2Icon className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentSection;
