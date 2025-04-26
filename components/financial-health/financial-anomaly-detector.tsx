"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { detectFinancialAnomalies } from "@/utils/financial-anomaly-detector"
import { AlertCircle, AlertTriangle, Info } from "lucide-react"

interface FinancialAnomalyDetectorProps {
  financialData: any
  period?: string
}

export function FinancialAnomalyDetector({ financialData, period = "当前" }: FinancialAnomalyDetectorProps) {
  const [anomalies, setAnomalies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (financialData) {
      // 检测财务异常
      const detectedAnomalies = detectFinancialAnomalies(financialData)
      setAnomalies(detectedAnomalies)
      setLoading(false)
    }
  }, [financialData])

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "高":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "中":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "低":
        return <Info className="h-5 w-5 text-blue-500" />
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "高":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      case "中":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case "低":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      default:
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>财务异常检测</CardTitle>
          <CardDescription>正在分析财务数据中的异常...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse p-4 border rounded-lg">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>财务异常检测</CardTitle>
        <CardDescription>{period}期间检测到的财务异常和风险点</CardDescription>
      </CardHeader>
      <CardContent>
        {anomalies.length === 0 ? (
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
            <h3 className="text-lg font-medium text-gray-900">未检测到异常</h3>
            <p className="mt-2 text-sm text-gray-500">当前财务数据未发现明显异常或风险点</p>
          </div>
        ) : (
          <div className="space-y-3">
            {anomalies.map((anomaly, index) => (
              <Alert key={index} className={getSeverityColor(anomaly.severity)}>
                <div className="flex items-start">
                  {getSeverityIcon(anomaly.severity)}
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <AlertTitle className="text-sm font-medium">{anomaly.title}</AlertTitle>
                      <Badge
                        variant="outline"
                        className={`ml-2 ${
                          anomaly.severity === "高"
                            ? "border-red-500 text-red-500"
                            : anomaly.severity === "中"
                              ? "border-yellow-500 text-yellow-500"
                              : "border-blue-500 text-blue-500"
                        }`}
                      >
                        {anomaly.severity}级风险
                      </Badge>
                    </div>
                    <AlertDescription className="mt-1 text-sm">{anomaly.description}</AlertDescription>
                    {anomaly.metrics && (
                      <div className="mt-2 text-xs grid grid-cols-2 gap-2">
                        {Object.entries(anomaly.metrics).map(([key, value]: [string, any]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-gray-600">{key}:</span>
                            <span className="font-medium">{value}</span>
                          </div>
                        ))}
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
