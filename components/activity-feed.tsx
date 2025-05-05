import { getRecentActivities } from "@/lib/data-service"

export async function ActivityFeed() {
  const activities = await getRecentActivities(5)

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start space-x-4">
          <div className="flex-shrink-0 rounded-full bg-muted p-2">
            <span className="text-lg">{activity.icon}</span>
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{activity.description}</p>
            <div className="flex items-center pt-1">
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">{activity.type}</span>
              <span className="text-xs text-muted-foreground ml-2">{activity.formattedTime}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
