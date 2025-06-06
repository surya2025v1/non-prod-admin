"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ButtonProps } from "@/components/ui/button"

interface DevotionalButtonOutlineProps extends ButtonProps {
  darkBackground?: boolean
}

export function DevotionalButtonOutline({
  children,
  className,
  darkBackground = false,
  ...props
}: DevotionalButtonOutlineProps) {
  return (
    <Button
      variant="outline"
      className={cn(
        "transition-all duration-300",
        darkBackground
          ? "border-white text-white hover:bg-white/10"
          : "border-maroon-600 text-maroon-700 hover:bg-maroon-50",
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  )
}
