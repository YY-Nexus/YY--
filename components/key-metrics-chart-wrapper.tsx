import { getKeyMetricsData } from "@/lib/data-service"
import { KeyMetricsChart } from "./key-metrics-chart"

export async function KeyMetricsChartWrapper() {
  const metricsData = await getKeyMetricsData()

  return <KeyMetricsChart initialData={metricsData} />
}
