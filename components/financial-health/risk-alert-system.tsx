"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Bell, BellOff, AlertTriangle, Settings } from "lucide-react"
import { evaluateFinancialRisks } from "@/utils/financial-risk-evaluator"

interface RiskAlertSystemProps {
  financialData: any
  period?: string
}

export function RiskAlertSystem({ financialData, period = "当前" }: RiskAlertSystemProps) {
  const [risks, setRisks] = useState<any[]>([])
  const [alertsEnabled, setAlertsEnabled] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (financialData) {
      // 评估财务风险
      const evaluatedRisks = evaluateFinancialRisks(financialData)
      setRisks(evaluatedRisks)
      setLoading(false)
    }
  }, [financialData])

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "严重":
        return "bg-red-100 text-red-800 border-red-200"
      case "高":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "中":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "低":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  const getRiskLevelBadge = (level: string) => {
    switch (level) {
      case "严重":
        return "bg-red-100 text-red-800 border-red-500"
      case "高":
        return "bg-orange-100 text-orange-800 border-orange-500"
      case "中":
        return "bg-yellow-100 text-yellow-800 border-yellow-500"
      case "低":
        return "bg-green-100 text-green-800 border-green-500"
      default:
        return "bg-blue-100 text-blue-800 border-blue-500"
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>风险预警系统</CardTitle>
          <CardDescription>正在评估财务风险...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <span>风险预警系统</span>
            </CardTitle>
            <CardDescription>{period}期间的财务风险预警</CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Switch id="alerts-mode" checked={alertsEnabled} onCheckedChange={setAlertsEnabled} />
              <Label htmlFor="alerts-mode" className="text-sm">
                {alertsEnabled ? (
                  <span className="flex items-center gap-1">
                    <Bell className="h-4 w-4" />
                    预警已启用
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <BellOff className="h-4 w-4" />
                    预警已禁用
                  </span>
                )}
              </Label>
            </div>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <Settings className="h-3.5 w-3.5" />
              <span className="text-xs">设置</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {risks.length === 0 ? (
          <div className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">未���测到风险</h3>
            <p className="mt-2 text-sm text-gray-500">当前财务状况良好，未发现需要预警的风险</p>
          </div>
        ) : (
          <div className="space-y-3">
            {risks.map((risk, index) => (
              <Alert key={index} className={`${getRiskLevelColor(risk.level)} border`}>
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5" />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <AlertTitle className="text-sm font-medium">{risk.title}</AlertTitle>
                      <Badge variant="outline" className={`ml-2 ${getRiskLevelBadge(risk.level)}`}>
                        {risk.level}风险
                      </Badge>
                    </div>
                    <AlertDescription className="mt-1 text-sm">{risk.description}</AlertDescription>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-xs">
                        <span className="font-medium">触发条件: </span>
                        <span>{risk.trigger}</span>
                      </div>
                      <div className="text-xs">
                        <span className="font-medium">预警时间: </span>
                        <span>{risk.alertTime || "实时"}</span>
                      </div>
                    </div>

                    {risk.recommendation && (
                      <div className="mt-2 text-xs p-2 bg-white bg-opacity-50 rounded">
                        <span className="font-medium">建议: </span>
                        <span>{risk.recommendation}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
