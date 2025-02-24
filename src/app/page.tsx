import { getPosts } from "@/actions/post.action";
import { getDbUserId } from "@/actions/user.action";
import CreatePost from "@/components/CreatePost";
import PostCard from "@/components/PostCard";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {

  const user = await currentUser();
  const posts = await getPosts();
  const dbUserId = await getDbUserId();


  return (
     
    <div className="w-full border" >
        {/* {user ? <CreatePost /> : null}    */}
        <CreatePost />     

        <div> 
        {posts.map((post) => (
            <PostCard key={post.id} post={post} dbUserId={dbUserId} />
          ))}
        </div>
         
    </div>
  // </main>
  );
}
