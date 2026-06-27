import { forwardRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface AvatarProps {
  className?: string;
  children?: React.ReactNode;
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, children }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full",
        className,
      )}
    >
      {children}
    </div>
  ),
);
Avatar.displayName = "Avatar";

interface AvatarImageProps {
  src: string;
  alt?: string;
  className?: string;
}

const AvatarImage = forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ src, alt = "", className }, ref) => (
    <Image
      ref={ref}
      src={src}
      alt={alt}
      fill
      className={cn("object-cover", className)}
    />
  ),
);
AvatarImage.displayName = "AvatarImage";

interface AvatarFallbackProps {
  className?: string;
  children?: React.ReactNode;
  delayMs?: number;
}

const AvatarFallback = forwardRef<HTMLDivElement, AvatarFallbackProps>(
  ({ className, children }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-brand/10 text-sm font-semibold text-brand",
        className,
      )}
    >
      {children}
    </div>
  ),
);
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };
