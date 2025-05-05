"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"

interface FieldConfig {
  type: "text" | "textarea" | "select" | "switch" | "number" | "date"
  name: string
  label: string
  placeholder?: string
  options?: { value: string; label: string }[]
  required?: boolean
  disabled?: boolean
}

interface MobileFormProps {
  title: string
  fields: FieldConfig[]
  onSubmit: (data: Record<string, any>) => void
  onCancel?: () => void
  submitLabel?: string
  cancelLabel?: string
  initialValues?: Record<string, any>
  loading?: boolean
}

export function MobileForm({
  title,
  fields,
  onSubmit,
  onCancel,
  submitLabel = "提交",
  cancelLabel = "取消",
  initialValues = {},
  loading = false,
}: MobileFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>(initialValues)

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const renderField = (field: FieldConfig) => {
    const value = formData[field.name] !== undefined ? formData[field.name] : ""

    switch (field.type) {
      case "text":
      case "number":
      case "date":
        return (
          <div className="space-y-2" key={field.name}>
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Input
              id={field.name}
              name={field.name}
              type={field.type}
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleChange(field.name, e.target.value)}
              required={field.required}
              disabled={field.disabled || loading}
            />
          </div>
        )
      case "textarea":
        return (
          <div className="space-y-2" key={field.name}>
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Textarea
              id={field.name}
              name={field.name}
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleChange(field.name, e.target.value)}
              required={field.required}
              disabled={field.disabled || loading}
            />
          </div>
        )
      case "select":
        return (
          <div className="space-y-2" key={field.name}>
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Select
              value={value}
              onValueChange={(value) => handleChange(field.name, value)}
              disabled={field.disabled || loading}
            >
              <SelectTrigger id={field.name}>
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )
      case "switch":
        return (
          <div className="flex items-center justify-between" key={field.name}>
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Switch
              id={field.name}
              checked={!!value}
              onCheckedChange={(checked) => handleChange(field.name, checked)}
              disabled={field.disabled || loading}
            />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            {onCancel && (
              <Button type="button" variant="ghost" size="icon" onClick={onCancel}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}
            <CardTitle>{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">{fields.map(renderField)}</CardContent>
        <CardFooter className="flex justify-between">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
              {cancelLabel}
            </Button>
          )}
          <Button type="submit" className={cn(onCancel ? "" : "w-full")} disabled={loading}>
            {loading ? "处理中..." : submitLabel}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
