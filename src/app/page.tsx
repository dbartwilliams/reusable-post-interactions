
import { getPosts } from "@/actions/post.action";
import { getDbUserId } from "@/actions/user.action";
import CreatePost from "@/components/CreatePost";
import PostCard from "@/components/PostCard";
import { currentUser } from "@clerk/nextjs/server";
import { Post } from "@prisma/client";

export default async function Home() {
  const user = await currentUser();
  const posts = await getPosts();
  const dbUserId = await getDbUserId();

  return (
    <div className="w-full border">
      <CreatePost />     
      <div> 
        {posts.map((post: Post & { 
          author: { 
            id: string; 
            name: string | null; 
            image: string | null; 
            username: string; 
          };
          comments: any[];
          likes: { userId: string }[];
          _count: { 
            likes: number;
            comments: number;
          };
        }) => (
          <PostCard key={post.id} post={post} dbUserId={dbUserId} />
        ))}
      </div>
    </div>
  );
}
