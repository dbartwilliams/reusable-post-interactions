
import React from 'react';
import { getRandomUsers } from "@/actions/user.action";
import FollowButton from "./FollowButton";
import { Avatar, AvatarImage } from "./ui/avatar";

interface User {
  id: string;
  name: string | null;
  username: string;
  image: string | null;
  _count: {
    followers: number;
  };
}

export default async function WhoToFollow() {
  const users = await getRandomUsers();

  return (
    <div className="px-6 py-4">
      <h2 className="mb-4 text-xl font-semibold">Who to follow</h2>
      <div className="space-y-4">
        {users.map((user: User) => (
          <div key={user.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={user.image ?? "/avatar.png"} />
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-sm text-muted-foreground">@{user.username}</p>
              </div>
            </div>
            <FollowButton userId={user.id} />
          </div>
        ))}
      </div>
    </div>
  );
}
