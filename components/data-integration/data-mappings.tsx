"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Plus, Trash2 } from "lucide-react"

export function DataMappings() {
  const [employeeMappings, setEmployeeMappings] = useState([
    { source: "employee_id", target: "id", transform: "none" },
    { source: "employee_name", target: "name", transform: "none" },
    { source: "employee_email", target: "email", transform: "none" },
    { source: "dept_name", target: "department", transform: "none" },
    { source: "job_title", target: "position", transform: "none" },
    { source: "hire_date", target: "hire_date", transform: "date" },
    { source: "emp_status", target: "status", transform: "status" },
  ])

  const [departmentMappings, setDepartmentMappings] = useState([
    { source: "dept_id", target: "id", transform: "none" },
    { source: "dept_name", target: "name", transform: "none" },
    { source: "dept_code", target: "code", transform: "none" },
    { source: "manager_id", target: "manager_id", transform: "none" },
    { source: "parent_dept_id", target: "parent_id", transform: "none" },
  ])

  const [performanceMappings, setPerformanceMappings] = useState([
    { source: "review_id", target: "id", transform: "none" },
    { source: "employee_id", target: "employee_id", transform: "none" },
    { source: "review_period", target: "review_period", transform: "none" },
    { source: "rating", target: "rating", transform: "rating" },
    { source: "reviewer_id", target: "reviewer_id", transform: "none" },
  ])

  const addMapping = (type: string) => {
    if (type === "employee") {
      setEmployeeMappings([...employeeMappings, { source: "", target: "", transform: "none" }])
    } else if (type === "department") {
      setDepartmentMappings([...departmentMappings, { source: "", target: "", transform: "none" }])
    } else if (type === "performance") {
      setPerformanceMappings([...performanceMappings, { source: "", target: "", transform: "none" }])
    }
  }

  const removeMapping = (type: string, index: number) => {
    if (type === "employee") {
      setEmployeeMappings(employeeMappings.filter((_, i) => i !== index))
    } else if (type === "department") {
      setDepartmentMappings(departmentMappings.filter((_, i) => i !== index))
    } else if (type === "performance") {
      setPerformanceMappings(performanceMappings.filter((_, i) => i !== index))
    }
  }

  const updateMapping = (type: string, index: number, field: string, value: string) => {
    if (type === "employee") {
      const newMappings = [...employeeMappings]
      newMappings[index] = { ...newMappings[index], [field]: value }
      setEmployeeMappings(newMappings)
    } else if (type === "department") {
      const newMappings = [...departmentMappings]
      newMappings[index] = { ...newMappings[index], [field]: value }
      setDepartmentMappings(newMappings)
    } else if (type === "performance") {
      const newMappings = [...performanceMappings]
      newMappings[index] = { ...newMappings[index], [field]: value }
      setPerformanceMappings(newMappings)
    }
  }

  const renderMappings = (type: string, mappings: any[]) => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-12 gap-4 font-medium text-sm">
          <div className="col-span-5">源字段</div>
          <div className="col-span-1"></div>
          <div className="col-span-4">目标字段</div>
          <div className="col-span-2">转换</div>
        </div>

        {mappings.map((mapping, index) => (
          <div key={index} className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-5">
              <Input
                value={mapping.source}
                onChange={(e) => updateMapping(type, index, "source", e.target.value)}
                placeholder="源字段名"
              />
            </div>
            <div className="col-span-1 flex justify-center">
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="col-span-4">
              <Input
                value={mapping.target}
                onChange={(e) => updateMapping(type, index, "target", e.target.value)}
                placeholder="目标字段名"
              />
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <Select
                value={mapping.transform}
                onValueChange={(value) => updateMapping(type, index, "transform", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="转换" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">无</SelectItem>
                  <SelectItem value="uppercase">大写</SelectItem>
                  <SelectItem value="lowercase">小写</SelectItem>
                  <SelectItem value="date">日期格式化</SelectItem>
                  <SelectItem value="number">数字格式化</SelectItem>
                  <SelectItem value="status">状态映射</SelectItem>
                  <SelectItem value="rating">评级映射</SelectItem>
                  <SelectItem value="custom">自定义</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="ghost" size="icon" onClick={() => removeMapping(type, index)} className="h-8 w-8">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        <Button variant="outline" size="sm" onClick={() => addMapping(type)} className="mt-2">
          <Plus className="mr-2 h-4 w-4" />
          添加映射
        </Button>
      </div>
    )
  }

  return (
    <Tabs defaultValue="employee">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="employee">员工数据</TabsTrigger>
        <TabsTrigger value="department">部门数据</TabsTrigger>
        <TabsTrigger value="performance">绩效数据</TabsTrigger>
      </TabsList>

      <TabsContent value="employee" className="space-y-4 pt-4">
        {renderMappings("employee", employeeMappings)}
      </TabsContent>

      <TabsContent value="department" className="space-y-4 pt-4">
        {renderMappings("department", departmentMappings)}
      </TabsContent>

      <TabsContent value="performance" className="space-y-4 pt-4">
        {renderMappings("performance", performanceMappings)}
      </TabsContent>

      <div className="flex justify-end mt-6">
        <Button>保存映射配置</Button>
      </div>
    </Tabs>
  )
}
