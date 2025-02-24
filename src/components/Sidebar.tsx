import React from 'react'
import Image from 'next/image';
import { currentUser } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/actions/user.action";
import Link from 'next/link';
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { LinkIcon, MapPinIcon } from "lucide-react";

async function Sidebar() {

  const authUser = await currentUser();
  if (!authUser) return <UnAuthenticatedSidebar />;

  const user = await getUserByClerkId(authUser.id);
  if (!user) return null;

  return (
    <div className="sticky top-20">
      <div className="relative flex flex-col items-center overflow-hidden text-center 
      rounded-lg dark:bg-gray-900 dark:border-none">

         {/* Banner Image */}
         <div className="relative w-full h-14">
          <Image 
           src="/small_banner.jpg"
            alt="Avatar"
            width={80} height={80} 

            className="object-cover w-full h-24"
          />
        </div>

         {/* Avatar Wrapper */}
         <div className="relative w-full">
          <div className="absolute transform -translate-x-1/2 top-2 left-1/2">
            <Image
              src={user.image ? user.image : "/short-logo.png"}
              alt="Avatar" 
              width={80}
              height={80}
              className="w-20 h-20 rounded-full border-4 border-white dark:border-[#1D2226]"
            />
          </div>
        </div>

        {/* User Info */}
        <div className="mt-12 pt-12 space-x-0.5">  {/* Increased padding to prevent overlap */}
        <Link
           href={`/profile/${user.username}`}>
          <h4 className="cursor-pointer hover:underline decoration-purple-700 underline-offset-1">
             {user.name}
          </h4>
          <p className="text-sm text-black/60 dark:text-white/75">
            {user.username}
          </p>
        </Link>
            {/* <hr className="px-12 my-2 border border-red-900"/> */}
            <Separator className="my-4" />

          <p className="text-sm text-gray-300 dark:text-gray-500">
          {user.bio}
          </p>
        </div>
        {/* end User Info */}


        {/* Stats */}
        <div className="w-full px-10 py-4">
          {/* <Separator className="my-4" /> */}
          <div className="flex justify-center space-x-4"> {/* Added space between buttons */}
            <Button className="px-4 py-2 text-sm font-medium border border-gray-800 
            rounded-lg bg-transparent text-gray-400">
              <p className="font-medium">
              {user._count.following} {user._count.following === 1 ? "Follower" : "Followings"}
              </p>
            </Button>
            <Button className="px-4 py-2 text-sm font-medium border border-gray-800 
            rounded-lg bg-transparent text-gray-400">
               <p className="text-xs text-muted-foreground">
               {user._count.followers} {user._count.followers === 1 ? "Follower" : "Followers"}
                </p>
            </Button>
          </div>
          {/* <Separator className="my-4" /> */}
        </div>
        {/* End Stats */}


        {/* More user atttriutes */}
        <div className="w-full flex justify-center  text-sm space-x-2 mb-4">
            <div className="flex items-center text-muted-foreground">
              <MapPinIcon className="w-4 h-4 mr-2" />
              {user.location || "No location"}
            </div>
            <div className="flex items-center text-muted-foreground">
              <LinkIcon className="w-4 h-4 mr-2 shrink-0" />
              {user.website ? (
                <a href={`${user.website}`} className="hover:underline truncate" target="_blank">
                  {user.website}
                </a>
              ) : (
                "No website"
              )}
            </div>
        </div>
          {/* end More user atttriutes */}

      </div>
    </div>
  )
}
export default Sidebar


const UnAuthenticatedSidebar = () => (
  <div className="sticky top-20">






<div className="relative flex flex-col items-center overflow-hidden text-center 
      rounded-lg dark:bg-gray-900 dark:border-none">
  {/* <!-- Dummy photo --> */}
  <div className="relative w-full h-14">
  <Image 
           src="/small_banner.jpg"
            alt="banner"
            width={80} height={80} 
            className="object-cover w-full h-24"
          />
  </div>
  {/* <!-- Card content --> */}
  <div className="mt-4 text-center mb-8">
    <h2 className="text-2xl font-bold text-gray-800">Welcome, Guest!</h2>
    <p className="mt-2 text-gray-200 text-sm px-4">
      Welcome to Africa24. Social Media for 1.5B Africans. A space to connect, 
      share, and speak freely, without restrictions.
    </p>
    {/* <!-- Login button --> */}
    <SignUpButton mode="modal">
          <button className="mt-4 inline-block bg-green-700 hover:bg-green-600 text-gray-300 font-semibold py-2 px-4 rounded">
          Log-In | Sign-Up
          </button>
      </SignUpButton>
  </div>
</div>

  </div>
);

