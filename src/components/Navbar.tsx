import Link from "next/link";
import Image from 'next/image'
import { currentUser } from "@clerk/nextjs/server";
import DesktopNavbar from "./DesktopNavbar";
import MobileNavbar from "./MobileNavbar";
import { syncUser } from "@/actions/user.action";

async function Navbar() {
  const user = await currentUser();
  if (user) await syncUser(); // POST

  return (
    <nav className="sticky top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="px-4 mx-auto max-w-7xl">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
          <Link href="/">
            <Image
              src="/africa24_main_logo.png"
              width={270}
              height={250}
              alt="Logo"
              className="font-mono text-xl font-bold tracking-wider text-primary rounded"
            />
          </Link>
          </div>

          <div>
            HOME
          </div>

          <DesktopNavbar />
          <MobileNavbar />
        </div>
      </div>
    </nav>
  );
}
export default Navbar;