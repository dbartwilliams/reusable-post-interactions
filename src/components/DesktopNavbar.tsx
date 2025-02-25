import { BellIcon, HomeIcon, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import ModeToggle from "./ModeToggle";

async function DesktopNavbar() {
  const user = await currentUser();

  return (
    <div className="items-center hidden space-x-4 md:flex">
      <ModeToggle />

      <Button variant="ghost" className="flex items-center gap-2" asChild>
        <Link href="/">
          <HomeIcon className="w-5 h-5 text-orange-400" />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>

      {user ? (
        <>

              <Button variant="ghost" className="flex items-center gap-2" asChild>
                <Link href="/notifications" className="relative">
                  <BellIcon className="w-5 h-5 text-orange-400" />
                  <span className="hidden lg:inline">Notifications</span>
                  <div className="absolute top-0 right-0 inline-block w-4 h-4 bg-red-500 text-white text-xs font-semibold flex p-4 rounded-full items-center justify-center">
                   
                    <span>20+</span>
                  </div>
                </Link>
              </Button>
              
          <Button variant="ghost" className="flex items-center gap-2" asChild>
            <Link
              href={`/profile/${
                user.username ?? user.emailAddresses[0].emailAddress.split("@")[0]
              }`}
            >
              <UserIcon className="w-5 h-5 text-orange-400" />
              <span className="hidden lg:inline">Profile</span>
            </Link>
          </Button>
          <UserButton />
        </>
      ) : (
        <SignInButton mode="modal">
          <Button variant="default">Sign In</Button>
        </SignInButton>
      )}
    </div>
  );
}
export default DesktopNavbar;