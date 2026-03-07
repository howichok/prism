"use client"

import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-[0.8rem] border text-sm font-medium whitespace-nowrap transition-[transform,background-color,border-color,color,box-shadow] duration-200 outline-none select-none focus-visible:ring-[3px] focus-visible:ring-ring/18 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50 active:translate-y-px [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 gap-2",
  {
    variants: {
      variant: {
        default:
          "border-primary/26 bg-[linear-gradient(180deg,hsl(221_83%_57%),hsl(221_83%_52%))] text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.09),0_16px_28px_-18px_rgba(37,99,235,0.75)] hover:-translate-y-0.5 hover:border-primary/34 hover:bg-[linear-gradient(180deg,hsl(221_83%_60%),hsl(221_83%_54%))]",
        outline:
          "border-white/10 bg-white/[0.025] text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:-translate-y-0.5 hover:border-white/16 hover:bg-white/[0.05]",
        secondary:
          "border-white/8 bg-white/[0.04] text-secondary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:-translate-y-0.5 hover:border-white/12 hover:bg-white/[0.07]",
        ghost: "border-transparent text-foreground hover:bg-white/[0.05] dark:hover:bg-white/[0.05]",
        destructive:
          "border-destructive/28 bg-destructive text-destructive-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] hover:-translate-y-0.5 hover:bg-destructive/90",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        xs: "h-7 rounded-[0.55rem] px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 rounded-[0.65rem] px-3 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-10 rounded-[0.8rem] px-6 text-sm",
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
