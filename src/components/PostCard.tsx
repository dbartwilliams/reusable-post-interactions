"use client";

import React, { useState } from 'react';
import toast from "react-hot-toast";
import { createComment, deletePost, getPosts, toggleLike } from "../actions/post.action";
import PostActions from './PostActions';
import PostDisplay from './PostDisplay';
import CommentSection from './CommentSection';
import NewComment from './NewComment';
import { useUser } from "@clerk/nextjs";

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
    <div className="bg-gray-900 border-l-[0.5px] border-r-[0.5px] border-t-4 border-b-[0.5px] border-gray-800 cursor-pointer">
      <PostDisplay
        author={post.author}
        content={post.content}
        image={post.image}
        createdAt={post.createdAt}
        currentUserId={dbUserId}
        onDelete={handleDeletePost}
        isDeleting={isDeleting}
      />

      {post.image && (
        <div className="h-auto mt-4 image-div">
          <img
            src={post.image}
            alt="Post_Content_Image"
            className="object-cover w-full h-auto shadow-xl"
          />
        </div>
      )}

      <PostActions
        likes={optimisticLikes}
        comments={post.comments.length}
        hasLiked={hasLiked}
        isLiking={isLiking}
        showComments={showComments}
        onLike={handleLike}
        onToggleComments={() => setShowComments(!showComments)}
      />

      {showComments && (
        <div className="pt-4 space-y-4 border-t">
          <CommentSection
            comments={post.comments}
            showComments={showComments}
          />
          <NewComment
            user={user}
            newComment={newComment}
            setNewComment={setNewComment}
            isCommenting={isCommenting}
            onAddComment={handleAddComment}
          />
        </div>
      )}
    </div>
  );
}

export default PostCard;