import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Mail, Phone, MapPin } from "lucide-react"

interface EmployeeHeaderProps {
  employee: any
}

export function EmployeeHeader({ employee }: EmployeeHeaderProps) {
  // 计算员工在职时长
  const calculateTenure = (hireDate: string) => {
    const hire = new Date(hireDate)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - hire.getTime())
    const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365))
    const diffMonths = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30))

    return `${diffYears}年${diffMonths}个月`
  }

  return (
    <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-primary/10">
            <Image
              src={employee.avatar_url || "/placeholder.svg?height=96&width=96&query=用户头像"}
              alt={employee.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <h1 className="text-2xl font-bold">{employee.name}</h1>
              <Badge variant="outline" className="w-fit">
                {employee.status === "active" ? "在职" : "离职"}
              </Badge>
            </div>

            <div className="text-lg text-muted-foreground">
              {employee.position} · {employee.departments?.name || employee.department}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground pt-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>{employee.email}</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>{employee.phone || "未设置"}</span>
              </div>

              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                <span>
                  入职时间: {new Date(employee.hire_date).toLocaleDateString("zh-CN")} (
                  {calculateTenure(employee.hire_date)})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{employee.location || "总部"}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
