import React from 'react';
import { HeartIcon, MessageCircleIcon, Share2Icon } from "lucide-react";

interface PostActionsProps {
  likes: number;
  comments: number;
  hasLiked: boolean;
  isLiking: boolean;
  showComments: boolean;
  onLike: () => Promise<void>;
  onToggleComments: () => void;
}

const PostActions = ({
  likes,
  comments,
  hasLiked,
  isLiking,
  showComments,
  onLike,
  onToggleComments,
}: PostActionsProps) => {
  return (
    <div className="flex items-center gap-4 px-20 py-2">
      {/* Like Button */}
      <button
        onClick={onLike}
        disabled={isLiking}
        className={`text-muted-foreground gap-2 flex items-center ${
          hasLiked ? "text-pink-500 hover:text-pink-600" : "hover:text-pink-500"
        }`}
      >
        <HeartIcon 
          className={`w-4 h-4 ${hasLiked ? "fill-current text-pink-500" : ""}`}/>
           <span>{likes}</span>
        {/* <span>{likes} {likes === 1 ? 'Like' : 'Likes'}</span> */}
      </button>

      {/* Share Button */}
      <button className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-yellow-500" disabled>
        <Share2Icon className="w-4 h-4"/> 
        {/* <span>Share</span> */}
      </button>0 

      {/* Comments Button */}
      <button
        onClick={onToggleComments}
        className="flex items-center gap-2 text-muted-foreground hover:text-green-500"
      >
        <MessageCircleIcon className="w-4 h-4" />
           <span>{comments}</span>
        {/* <span>{comments} {comments === 1 ? 'Comment' : 'Comments'}</span> */}
      </button>
    </div>
  );
};

export default PostActions;