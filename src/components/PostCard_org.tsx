"use client";
import React from 'react'
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useState } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { DeleteAlertDialog } from "./DeleteAlertDialog";
import { SignInButton, useUser } from "@clerk/nextjs";
import { createComment, deletePost, getPosts, toggleLike } from "@/actions/post.action";
import { HeartIcon, LogInIcon, MessageCircleIcon, Share2Icon, SendIcon } from "lucide-react";

type Posts = Awaited<ReturnType<typeof getPosts>>;
type Post = Posts[number];

function PostCard({ post, dbUserId }: { post: Post; dbUserId: string | null }) {
    const { user } = useUser();
    const [newComment, setNewComment] = useState("");
    const [isCommenting, setIsCommenting] = useState(false);
    const [isLiking, setIsLiking] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [hasLiked, setHasLiked] = useState(post.likes.some((like) => like.userId === dbUserId));
    const [optimisticLikes, setOptmisticLikes] = useState(post._count.likes);
    const [showComments, setShowComments] = useState(false);
  

    const handleLike = async () => {
      if (isLiking) return;
      try {
        setIsLiking(true);
        setHasLiked((prev) => !prev);
        setOptmisticLikes((prev) => prev + (hasLiked ? -1 : 1));
        await toggleLike(post.id);
      } catch (error) {
        setOptmisticLikes(post._count.likes);
        setHasLiked(post.likes.some((like) => like.userId === dbUserId));
      } finally {
        setIsLiking(false);
      }
    };

    const handleAddComment = async () => {
      if (!newComment.trim() || isCommenting) return;
      try {
        setIsCommenting(true);
        const result = await createComment(post.id, newComment);
        if (result?.success) {
          toast.success("Comment posted successfully");
          setNewComment("");
        }
      } catch (error) {
        toast.error("Failed to add comment");
      } finally {
        setIsCommenting(false);
      }
    };

    const handleDeletePost = async () => {
      if (isDeleting) return;
      try {
        setIsDeleting(true);
        const result = await deletePost(post.id);
        if (result.success) toast.success("Post deleted successfully");
        else throw new Error(result.error);
      } catch (error) {
        toast.error("Failed to delete post");
      } finally {
        setIsDeleting(false);
      }
    };

    return (
    <div className="bg-gray-900 border-l-[0.5px] border-r-[0.5px] border-t-4 border-b-[0.5px] border-gray-800 
    cursor-pointer ">
        
        {/* Profile Image, Username, and Content */}
        <div className="flex px-4 space-x-4 p-2 hover:bg-gray-800">

             {/* Profile Image */}
             <Link href={`/profile/${post.author.username}`}>
                <div className="flex-shrink-0">
                <img
                     src={post.author.image ?? "/avatar.png"}
                    alt="Profile"
                    className="w-12 h-12 mr-1 rounded-full"
                />
                </div>
            </Link>
            {/* End Profile Image */}
    
            {/* USERNAME AND CONTENT */}  
            <div className="flex-1">
            {/* Username */}
            <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
                  <span className="font-semibold text-yellow-500">@{post.author.username}</span>
                  <span className="text-sm text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(post.createdAt))} ago
                  </span>
                </div>

              {/* Check if current user is the post author */}
              {dbUserId === post.author.id && (
                <DeleteAlertDialog isDeleting={isDeleting} onDelete={handleDeletePost} />
              )}
            </div>
    
            {/* Content Div */}
            <div className="h-auto content-div p-4">
            <p>{post.content}</p>
            </div>
          </div>
        </div>

         {/* Image Div */}

         {post.image && (
          <div className="h-auto mt-4 image-div">
            <img
              src={post.image}
              alt="Post content"
              className="object-cover w-full h-auto shadow-xl"
            />
          </div>
        )}

        {/* PostActions Section */}
        <div className="flex items-center justify-between px-20 py-2 bg-gray-700 shadow-lg">
            {/* LIKE AND UNLIKE */}
            <button
              onClick={handleLike}
              className={`text-muted-foreground gap-2 flex items-center ${
                hasLiked ? "text-pink-500 hover:text-pink-600" : "hover:text-pink-500"
              }`}
              
            >
              <HeartIcon 
                className={`w-5 h-5 ${hasLiked ? "fill-current text-pink-500" : ""}`}
              />

              <span>{optimisticLikes} {optimisticLikes === 1 ? 'Like' : 'Likes'}</span>
            </button>
            {/* END LIKE AND UNLIKE */}


            {/* SHARE */}
            <button className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-yellow-500" disabled>
              <Share2Icon className="w-5 h-5"/> 
              <span>Share</span>
            </button>
            {/* END SHARE */}
      
            {/* COMMENTS SECTION */}
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2 text-muted-foreground hover:text-green-500"
            >
              <MessageCircleIcon className="w-5 h-5" />
              <span>{post.comments.length} {post.comments.length === 1 ? 'Comment' : 'Comments'}</span>

            </button>
        </div>





        {/* Comments Section */}
        {showComments && (
          <div className="pt-4 space-y-4 border-t">
            <div className="space-y-4 bg-red-700">
              {/* DISPLAY COMMENTS */}
              {post.comments.map((comment) => (
                <div key={comment.id} className="flex p-3 space-x-3">
                  <div className="flex-shrink-0 size-8">
                    <img src={comment.author.image ?? "/avatar.png"} alt='comment' 
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
                  </div>
                </div>
              ))}
            </div>



            {/* Add Comment Section */}
            {user ? (
              <div className="flex p-2 space-x-3">
                <div className="flex-shrink-0">
                  <img src={user?.imageUrl || "/avatar.png"} alt='user'
                  className="w-10 h-10 mr-1 rounded-full" />
                </div>
                <div className="flex-1">
                  <Textarea
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[80px] resize-none"
                  />
                  <div className="flex justify-end mt-2">
                    <Button
                      size="sm"
                      onClick={handleAddComment}
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
            ) : (



              <div className="flex justify-center p-4 border rounded-lg bg-muted/50">
                <SignInButton mode="modal">
                <button className="mt-4 inline-block bg-green-700 hover:bg-green-600 text-gray-300 font-semibold py-2 px-4 rounded">
                    <LogInIcon className="size-4" />
                    Sign-In
                  </button>
                </SignInButton>
              </div>
            )}
          </div>
        )}

    </div>
  )
}
export default PostCard



