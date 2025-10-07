"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button, type ButtonProps } from "@/components/ui/button"

interface TouchOptimizedButtonProps extends ButtonProps {
  touchTarget?: boolean
}

const TouchOptimizedButton = React.forwardRef<HTMLButtonElement, TouchOptimizedButtonProps>(
  ({ className, touchTarget = true, ...props }, ref) => {
    return (
      <Button
        className={cn(
          touchTarget && "min-h-[44px] min-w-[44px] touch-manipulation",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
TouchOptimizedButton.displayName = "TouchOptimizedButton"

export { TouchOptimizedButton, type TouchOptimizedButtonProps }
