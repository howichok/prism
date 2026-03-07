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
      className={cn("ring-1 ring-border", className)}
      style={{
        background:
          accentColor && !image
            ? `linear-gradient(135deg, ${accentColor}, hsl(0 0% 10%))`
            : undefined,
      }}
    >
      {image ? <AvatarImage src={image} alt={name ?? "Prism member"} /> : null}
      <AvatarFallback className="bg-secondary text-xs font-medium text-foreground">{getInitials(name)}</AvatarFallback>
    </Avatar>
  );
}
