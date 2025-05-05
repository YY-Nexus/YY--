"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { useNavigation } from "@/hooks/use-navigation"
import { motion } from "framer-motion"

export function NavToggle() {
  const { isExpanded, toggleExpanded } = useNavigation()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleExpanded}
      className="absolute -right-4 top-6 z-10 h-8 w-8 rounded-full border bg-background shadow-md"
      aria-label={isExpanded ? "收起导航栏" : "展开导航栏"}
    >
      <motion.div initial={false} animate={{ rotate: isExpanded ? 0 : 180 }} transition={{ duration: 0.3 }}>
        <ChevronLeft className="h-4 w-4" />
      </motion.div>
    </Button>
  )
}
