import { getRandomUsers } from "@/actions/user.action";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Link from "next/link";
import { Avatar, AvatarImage } from "./ui/avatar";
import FollowButton from "./FollowButton";
import { currentUser } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/actions/user.action";

async function WhoToFollow() {

    const authUser = await currentUser();
    if (!authUser) return <UnAuthenticatedSidebar />;
  
    const user = await getUserByClerkId(authUser.id);
    if (!user) return null;


  const users = await getRandomUsers();
  if (users.length === 0) return null;

  return (
    <Card className="dark:bg-gray-900">
      <CardHeader>
        <CardTitle>Who to Follow</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between gap-2 ">
              <div className="flex items-center gap-1">
                <Link href={`/profile/${user.username}`}>
                <div className="flex-shrink-0">
                  <img
                    src={user.image ?? "/avatar.png"}
                    alt="Profile"
                    className="w-12 h-12 mr-2 rounded-full"/>
                </div>
                </Link>
                <div className="text-xs">
                  <Link href={`/profile/${user.username}`} className="font-medium cursor-pointer">
                    {user.username}
                  </Link>
                  <p className="text-muted-foreground">@{user.username}</p>
                  <p className="text-muted-foreground">{user._count.followers} followers</p>
                </div>
              </div>
              <FollowButton userId={user.id} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
export default WhoToFollow;



const UnAuthenticatedSidebar = () => (
  <div className="sticky top-20">
      You are not Authenticated
</div>


);
