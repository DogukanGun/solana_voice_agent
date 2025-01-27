"use client";

import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";

export default function UserSettings() {
  const [isLoading, setIsLoading] = useState(true);
  const { address } = useAppKitAccount()
  const { open, close } = useAppKit()


  return (
    <Button
      variant="ghost"
      onClick={()=>open()}
      className="flex justify-start gap-3 w-full h-14 text-base font-normal items-center "
    >
      <Avatar className="flex justify-start items-center overflow-hidden">
        <AvatarImage
          src=""
          alt="AI"
          width={4}
          height={4}
          className="object-contain"
        />
        <AvatarFallback>
          {address && address.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="text-xs truncate">
        {isLoading ? (
          <Skeleton className="w-20 h-4" />
        ) : (
          address || "Anonymous"
        )}
      </div>
    </Button>
  );
}
