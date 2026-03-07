"use client"

import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-[0.75rem] border text-sm font-medium whitespace-nowrap transition-[transform,background-color,border-color,color,box-shadow] duration-200 outline-none select-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 gap-2",
  {
    variants: {
      variant: {
        default:
          "border-primary/30 bg-primary text-primary-foreground shadow-[0_10px_30px_rgba(37,99,235,0.18)] hover:-translate-y-0.5 hover:bg-[hsl(221_83%_58%)]",
        outline:
          "border-border bg-background/55 shadow-sm hover:-translate-y-0.5 hover:border-primary/30 hover:bg-white/[0.05] text-foreground",
        secondary:
          "border-white/8 bg-secondary/80 text-secondary-foreground hover:-translate-y-0.5 hover:bg-secondary",
        ghost: "border-transparent text-foreground hover:bg-white/5 dark:hover:bg-white/5",
        destructive:
          "border-destructive/35 bg-destructive text-destructive-foreground hover:-translate-y-0.5 hover:bg-destructive/90 shadow-sm",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        xs: "h-7 rounded-[0.55rem] px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 rounded-[0.65rem] px-3 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-10 rounded-[0.8rem] px-8 text-sm",
        icon: "size-9 rounded-[0.75rem]",
        "icon-xs": "size-6 rounded-[0.55rem] [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8 rounded-[0.65rem]",
        "icon-lg": "size-10 rounded-[0.8rem]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
