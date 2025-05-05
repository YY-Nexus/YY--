"use client"

import type React from "react"

import { Button, type ButtonProps } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { forwardRef } from "react"

interface InteractiveButtonProps extends ButtonProps {
  href?: string
  onAction?: () => void
}

export const InteractiveButton = forwardRef<HTMLButtonElement, InteractiveButtonProps>(
  ({ href, onAction, children, className, ...props }, ref) => {
    const router = useRouter()

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (props.onClick) {
        props.onClick(e)
      }

      if (onAction) {
        onAction()
      } else if (href) {
        router.push(href)
      }
    }

    return (
      <Button ref={ref} className={className} {...props} onClick={handleClick}>
        {children}
      </Button>
    )
  },
)

InteractiveButton.displayName = "InteractiveButton"
