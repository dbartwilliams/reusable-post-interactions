"use client";

import React, { useState } from 'react';
import { SignInButton } from "@clerk/nextjs";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { LogInIcon, SendIcon,  } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

interface NewCommentProps {
  user: any; // Replace with proper Clerk user type
  newComment: string;
  setNewComment: (comment: string) => void;
  isCommenting: boolean;
  onAddComment: () => Promise<void>;
}

const NewComment = ({
  user,
  newComment,
  setNewComment,
  isCommenting,
  onAddComment
}: NewCommentProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!user) {
    return (
      <div className="flex justify-center p-4 border rounded-lg bg-muted/50 ">
        <SignInButton mode="modal">
          <button className="mt-4 inline-block bg-green-700 hover:bg-green-600 text-gray-300 font-semibold py-2 px-4 rounded">
            <LogInIcon className="size-4" />
            Sign-In
          </button>
        </SignInButton>
      </div>
    );
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild className=''>
      <button 
        className="flex py-2 w-full text-center mx-auto justify-center items-center hover:text-yellow-600">
        <SendIcon className="size-4 mr-2" />
          Add New Comment
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>New Comment</DialogTitle>
        </DialogHeader>
        <div className="flex p-2 space-x-3">
          <div className="flex-shrink-0">
            <img 
              src={user?.imageUrl || "/avatar.png"} 
              alt="user"
              className="w-10 h-10 mr-1 rounded-full" 
            />
          </div>
          <div className="flex-1">
            <Textarea
              placeholder="Write something nice..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[120px] resize-none"
            />
            <div className="flex justify-end mt-2">
              <Button
                size="sm"
                onClick={async () => {
                  await onAddComment();
                  setIsModalOpen(false);
                }}
                className="flex items-center gap-2"
                disabled={!newComment.trim() || isCommenting}
              >
                {isCommenting ? (
                  "Posting..."
                ) : (
                  <>
                    <SendIcon className="size-4" />
                    Comment
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewComment;