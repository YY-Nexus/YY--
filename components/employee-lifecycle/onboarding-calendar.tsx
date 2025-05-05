"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"

export function OnboardingCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  // 模拟数据：入职日期和对应的员工数量
  const onboardingDates = {
    "2023-12-25": 2,
    "2023-12-28": 1,
    "2024-01-02": 3,
    "2024-01-08": 1,
    "2024-01-15": 2,
  }

  // 格式化日期为 YYYY-MM-DD
  const formatDate = (date: Date): string => {
    return date.toISOString().split("T")[0]
  }

  return (
    <div className="space-y-4">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
        components={{
          DayContent: ({ day }) => {
            const formattedDate = formatDate(day)
            const count = onboardingDates[formattedDate]

            return (
              <div className="relative h-9 w-9 p-0 flex items-center justify-center">
                <span>{day.getDate()}</span>
                {count && (
                  <Badge
                    className="absolute -bottom-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
                    variant="default"
                  >
                    {count}
                  </Badge>
                )}
              </div>
            )
          },
        }}
      />

      <div className="space-y-2">
        <h4 className="text-sm font-medium">即将入职</h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm border-b pb-2">
            <span>2023-12-25</span>
            <span className="font-medium">2人入职</span>
          </div>
          <div className="flex justify-between items-center text-sm border-b pb-2">
            <span>2023-12-28</span>
            <span className="font-medium">1人入职</span>
          </div>
          <div className="flex justify-between items-center text-sm border-b pb-2">
            <span>2024-01-02</span>
            <span className="font-medium">3人入职</span>
          </div>
        </div>
      </div>
    </div>
  )
}
