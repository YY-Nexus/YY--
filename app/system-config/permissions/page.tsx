import type { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PermissionsHeader } from "@/components/permissions/permissions-header"
import { UserManagement } from "@/components/permissions/user-management"
import { RoleManagement } from "@/components/permissions/role-management"
import { PermissionMatrix } from "@/components/permissions/permission-matrix"
import { AccessLogs } from "@/components/permissions/access-logs"

export const metadata: Metadata = {
  title: "用户权限系统 | 言语「逸品」数字驾驶舱",
  description: "基于角色的访问控制，确保数据安全与合规",
}

export default function PermissionsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PermissionsHeader />

      <main className="flex-1 space-y-6 p-6 pt-4 md:p-8 md:pt-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">用户权限系统</h1>
          <p className="text-muted-foreground">基于角色的访问控制，确保数据安全与合规</p>
        </div>

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">用户管理</TabsTrigger>
            <TabsTrigger value="roles">角色管理</TabsTrigger>
            <TabsTrigger value="permissions">权限矩阵</TabsTrigger>
            <TabsTrigger value="logs">访问日志</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <UserManagement />
          </TabsContent>

          <TabsContent value="roles" className="space-y-4">
            <RoleManagement />
          </TabsContent>

          <TabsContent value="permissions" className="space-y-4">
            <PermissionMatrix />
          </TabsContent>

          <TabsContent value="logs" className="space-y-4">
            <AccessLogs />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
