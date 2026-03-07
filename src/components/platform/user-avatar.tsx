import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/format";
import { cn } from "@/lib/utils";

type UserAvatarProps = {
  name: string | null | undefined;
  image?: string | null;
  accentColor?: string | null;
  size?: "sm" | "default" | "lg";
  className?: string;
};

export function UserAvatar({ name, image, accentColor, size = "default", className }: UserAvatarProps) {
  return (
    <Avatar
      size={size}
      className={cn("ring-1 ring-white/10", className)}
      style={{
        background:
          accentColor && !image
            ? `linear-gradient(135deg, ${accentColor} 0%, rgba(8, 15, 30, 0.94) 100%)`
            : undefined,
      }}
    >
      {image ? <AvatarImage src={image} alt={name ?? "Prism member"} /> : null}
      <AvatarFallback className="bg-white/6 font-medium text-white">{getInitials(name)}</AvatarFallback>
    </Avatar>
  );
}
