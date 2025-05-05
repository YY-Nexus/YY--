import { NextResponse } from "next/server"
import { getSupabase } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // 验证数据
    if (!data || !data.metrics) {
      return NextResponse.json({ error: "无效的性能数据" }, { status: 400 })
    }

    // 获取Supabase客户端
    const supabase = getSupabase()

    // 将性能数据存储到数据库
    const { error } = await supabase.from("performance_metrics").insert({
      timestamp: new Date().toISOString(),
      url: data.url,
      user_agent: data.userAgent,
      metrics: data.metrics,
    })

    if (error) {
      console.error("存储性能指标失败:", error)
      return NextResponse.json({ error: "存储性能指标失败" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("处理性能指标请求失败:", error)
    return NextResponse.json({ error: "处理请求失败" }, { status: 500 })
  }
}
