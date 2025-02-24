import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HomeIcon, ArrowLeftIcon } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] grid place-items-center px-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="space-y-6 text-center">

            <div>
              {/* LOGO */}
              <img src="/africa24_main_logo.png" alt="Logo" className="rounded w-200 h-200" />
            </div>
     

            {/* LARGE 404 TEXT */}
            <p className="font-mono font-bold text-8xl text-primary">404</p>

            {/* MESSAGE */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">User not found</h1>
              <p className="text-muted-foreground">The user you're looking for doesn't exist.</p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Button variant="default" asChild>
                <Link href="/">
                  <HomeIcon className="mr-2 size-4" />
                  Get out of here....
                </Link>
              </Button>

              {/* <Button variant="outline" asChild>
                <Link href="/">
                  <ArrowLeftIcon className="mr-2 size-4" />
                  Home
                </Link>
              </Button> */}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
