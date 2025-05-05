export function OrganizationStats() {
  const stats = [
    { label: "部门总数", value: "12", change: "+2", changeType: "positive" },
    { label: "岗位总数", value: "48", change: "+5", changeType: "positive" },
    { label: "在职人数", value: "156", change: "+12", changeType: "positive" },
    { label: "管理跨度", value: "1:8", change: "-0.5", changeType: "negative" },
    { label: "组织层级", value: "5", change: "0", changeType: "neutral" },
    { label: "空缺岗位", value: "8", change: "-3", changeType: "positive" },
  ]

  return (
    <div className="space-y-4">
      {stats.map((stat, index) => (
        <div key={index} className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">{stat.label}</span>
          <div className="flex items-center gap-2">
            <span className="font-medium">{stat.value}</span>
            <span
              className={`text-xs ${
                stat.changeType === "positive"
                  ? "text-green-500"
                  : stat.changeType === "negative"
                    ? "text-red-500"
                    : "text-gray-500"
              }`}
            >
              {stat.change}
            </span>
          </div>
        </div>
      ))}

      <div className="pt-2 mt-4 border-t">
        <div className="text-sm font-medium">组织健康度评分</div>
        <div className="flex items-center mt-2">
          <div className="flex-1 bg-muted rounded-full h-2 mr-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: "78%" }}></div>
          </div>
          <span className="text-sm font-medium">78%</span>
        </div>
      </div>
    </div>
  )
}
