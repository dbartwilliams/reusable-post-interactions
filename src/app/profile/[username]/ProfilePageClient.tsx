"use client";

import { getProfileByUsername, getUserPosts, updateProfile } from "@/actions/profile.action";
import { toggleFollow } from "@/actions/user.action";
import PostCard from "@/components/PostCard";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/Modal";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignInButton, useUser } from "@clerk/nextjs";
import { format } from "date-fns";
import {
  CalendarIcon,
  EditIcon,
  FileTextIcon,
  HeartIcon,
  LinkIcon,
  MapPinIcon,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

type User = Awaited<ReturnType<typeof getProfileByUsername>>;
type Posts = Awaited<ReturnType<typeof getUserPosts>>;

interface ProfilePageClientProps {
  user: NonNullable<User>;
  posts: Posts;
  likedPosts: Posts;
  isFollowing: boolean;
}

function ProfilePageClient({
  isFollowing: initialIsFollowing,
  likedPosts,
  posts,
  user,
}: ProfilePageClientProps) {
  const { user: currentUser } = useUser();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isUpdatingFollow, setIsUpdatingFollow] = useState(false);

  const [editForm, setEditForm] = useState({
    name: user.name || "",
    bio: user.bio || "",
    location: user.location || "",
    website: user.website || "",
  });

  const handleEditSubmit = async () => {
    const formData = new FormData();
    Object.entries(editForm).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const result = await updateProfile(formData);
    if (result.success) {
      setShowEditDialog(false);
      toast.success("Profile updated successfully");
    }
  };

  const handleFollow = async () => {
    if (!currentUser) return;

    try {
      setIsUpdatingFollow(true);
      await toggleFollow(user.id);
      setIsFollowing(!isFollowing);
    } catch (error) {
      toast.error("Failed to update follow status");
    } finally {
      setIsUpdatingFollow(false);
    }
  };

  const isOwnProfile =
    currentUser?.username === user.username ||
    currentUser?.emailAddresses[0].emailAddress.split("@")[0] === user.username;

  const formattedDate = format(new Date(user.createdAt), "MMMM yyyy");

  return (
    <div className="w-full" >
      <div className="border-l-[0.5px] border-r-[0.5px] border-t-4 border-b-[0.5px] border-gray-800 cursor-pointer p-4">
          <div className="flex flex-col items-center text-center bg-gray-900">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={user.image ?? "/avatar.png"} />
                  </Avatar>
                  <h1 className="mt-4 text-2xl font-bold">{user.name ?? user.username}</h1>
                  <p className="text-muted-foreground">@{user.username}</p>
                  <p className="mt-2 text-sm">{user.bio}</p>

                {/* PROFILE STATS */}
                <div className="w-full mt-6">
                  <div className="flex justify-center  space-x-6 mb-4">
                    <div>
                      <div className="font-semibold">{user._count.following.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Following</div>
                    </div>
                    <Separator orientation="vertical" />
                    <div>
                      <div className="font-semibold">{user._count.followers.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Followers</div>
                    </div>
                    <Separator orientation="vertical" />
                    <div>
                      <div className="font-semibold">{user._count.posts.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Posts</div>
                    </div>
                  </div>
                </div>
                 {/* END PROFILE STATS */}

                {/* "FOLLOW & EDIT PROFILE" BUTTONS */}
                {!currentUser ? (
                  <SignInButton mode="modal">
                    <Button className="w-full mt-4">Follow</Button>
                  </SignInButton>
                ) : isOwnProfile ? (
                  <button type="button" 
                    className="flex w-full justify-center items-center p-3 bg-gray-600 hover:bg-gray-500 text-gray-300" 
                    onClick={() => setShowEditDialog(true)}>
                    <EditIcon className="size-4 mr-2" />
                    Edit Profile
                  </button>
                ) : (
                  <Button
                    className="w-full mt-4"
                    onClick={handleFollow}
                    disabled={isUpdatingFollow}
                    variant={isFollowing ? "outline" : "default"}
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </Button>
                )}
                {/* "END FOLLOW & EDIT PROFILE" BUTTONS */}

                  {/* LOCATION & WEBSITE */}
                  <div className="w-full py-4 text-sm flex items-center space-x-3 ml-6">
                  {user.location && (
                    <div className="flex items-center text-muted-foreground">
                      <MapPinIcon className="size-4 mr-2" />
                      {user.location}
                    </div>
                  )}
                  {user.website && (
                    <div className="flex items-center text-muted-foreground">
                      <LinkIcon className="size-4 mr-2" />
                      <a
                        href={
                          user.website.startsWith("http") ? user.website : `https://${user.website}`
                        }
                        className="hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {user.website}
                      </a>
                    </div>
                  )}

                  <div className="flex items-center text-muted-foreground">
                    <CalendarIcon className="size-4 mr-2" />
                    Joined {formattedDate}
                  </div>
                </div>
              {/* </div> */}

              <Tabs defaultValue="posts" className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                <TabsTrigger
                  value="posts"
                  className="flex items-center gap-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary
                   data-[state=active]:bg-transparent px-6 font-semibold"
                >
                  <FileTextIcon className="size-4" />
                  Posts
                </TabsTrigger>
                <TabsTrigger
                  value="likes"
                  className="flex items-center gap-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary
                   data-[state=active]:bg-transparent px-6 font-semibold"
                >
                  <HeartIcon className="size-4" />
                  Likes
                </TabsTrigger>
              </TabsList>

              <TabsContent value="posts" className="mt-3">
                <div className="text-start">
                  {posts.length > 0 ? (
                    posts.map((post) => <PostCard key={post.id} post={post} dbUserId={user.id} />)
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">No posts yet</div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="likes" className="mt-3">
              <div className="text-start">
                  {likedPosts.length > 0 ? (
                    likedPosts.map((post) => <PostCard key={post.id} post={post} dbUserId={user.id} />)
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">No liked posts to show</div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

              {/* MODAL */}
            <Modal
              showEditDialog={showEditDialog}
              setShowEditDialog={setShowEditDialog}
              editForm={editForm}
              setEditForm={setEditForm}
              handleEditSubmit={handleEditSubmit}
            />
            {/* END MODAL */}

          </div>
      </div>
</div>
  );
}
export default ProfilePageClient;
