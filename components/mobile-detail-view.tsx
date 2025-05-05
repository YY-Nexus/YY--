"use client"

import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface MobileDetailViewProps {
  title: string
  data: Record<string, any>
  fields: {
    key: string
    label: string
    render?: (value: any) => React.ReactNode
  }[]
  onBack?: () => void
  actions?: React.ReactNode
  children?: React.ReactNode
}

export function MobileDetailView({ title, data, fields, onBack, actions, children }: MobileDetailViewProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          <h2 className="text-xl font-bold">{title}</h2>
        </div>
        {actions && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">{actions}</DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            {fields.map((field) => (
              <div key={field.key} className="flex flex-col">
                <span className="text-sm text-muted-foreground">{field.label}</span>
                <span className="font-medium">{field.render ? field.render(data[field.key]) : data[field.key]}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {children}
    </div>
  )
}
