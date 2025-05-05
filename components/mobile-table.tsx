"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface MobileTableProps {
  data: any[]
  columns: {
    key: string
    title: string
    render?: (value: any, record: any) => React.ReactNode
  }[]
  keyField: string
  actions?: (record: any) => React.ReactNode
}

export function MobileTable({ data, columns, keyField, actions }: MobileTableProps) {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <div className="space-y-4">
      {data.map((record) => {
        const id = record[keyField]
        const isExpanded = expandedRows[id]

        return (
          <Card key={id} className="overflow-hidden">
            <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => toggleRow(id)}>
              <div className="flex-1">
                <div className="font-medium">{record[columns[0].key]}</div>
                <div className="text-sm text-muted-foreground">
                  {columns[1] &&
                    (columns[1].render ? columns[1].render(record[columns[1].key], record) : record[columns[1].key])}
                </div>
              </div>
              <Button variant="ghost" size="icon">
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>

            <div className={cn("border-t", isExpanded ? "block" : "hidden")}>
              <div className="p-4 space-y-3">
                {columns.slice(2).map((column) => (
                  <div key={column.key} className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{column.title}</span>
                    <span className="text-sm font-medium">
                      {column.render ? column.render(record[column.key], record) : record[column.key]}
                    </span>
                  </div>
                ))}

                {actions && <div className="pt-3 border-t mt-3">{actions(record)}</div>}
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
