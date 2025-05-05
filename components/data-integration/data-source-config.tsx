"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { TestTube } from "lucide-react"

export function DataSourceConfig() {
  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "success" | "error">("idle")

  const handleTestConnection = () => {
    setTestStatus("testing")

    // 模拟测试连接
    setTimeout(() => {
      setTestStatus("success")
    }, 1500)
  }

  return (
    <Tabs defaultValue="database">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="database">数据库</TabsTrigger>
        <TabsTrigger value="api">API</TabsTrigger>
        <TabsTrigger value="file">文件</TabsTrigger>
        <TabsTrigger value="erp">ERP系统</TabsTrigger>
      </TabsList>

      <TabsContent value="database" className="space-y-4 pt-4">
        <div className="grid gap-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="db-type" className="text-right">
              数据库类型
            </Label>
            <Select defaultValue="postgresql">
              <SelectTrigger id="db-type" className="col-span-3">
                <SelectValue placeholder="选择数据库类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="postgresql">PostgreSQL</SelectItem>
                <SelectItem value="mysql">MySQL</SelectItem>
                <SelectItem value="sqlserver">SQL Server</SelectItem>
                <SelectItem value="oracle">Oracle</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="db-host" className="text-right">
              主机地址
            </Label>
            <Input id="db-host" placeholder="localhost" className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="db-port" className="text-right">
              端口
            </Label>
            <Input id="db-port" placeholder="5432" className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="db-name" className="text-right">
              数据库名
            </Label>
            <Input id="db-name" placeholder="hrms" className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="db-user" className="text-right">
              用户名
            </Label>
            <Input id="db-user" placeholder="admin" className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="db-password" className="text-right">
              密码
            </Label>
            <Input id="db-password" type="password" placeholder="••••••••" className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="db-ssl" className="text-right">
              使用SSL
            </Label>
            <div className="col-span-3 flex items-center space-x-2">
              <Switch id="db-ssl" />
              <Label htmlFor="db-ssl">启用安全连接</Label>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={handleTestConnection} disabled={testStatus === "testing"}>
              {testStatus === "testing" ? (
                <>
                  <TestTube className="mr-2 h-4 w-4 animate-spin" />
                  测试中...
                </>
              ) : testStatus === "success" ? (
                <>
                  <TestTube className="mr-2 h-4 w-4 text-green-500" />
                  测试连接
                </>
              ) : testStatus === "error" ? (
                <>
                  <TestTube className="mr-2 h-4 w-4 text-red-500" />
                  测试连接
                </>
              ) : (
                <>
                  <TestTube className="mr-2 h-4 w-4" />
                  测试连接
                </>
              )}
            </Button>
            <Button>保存配置</Button>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="api" className="space-y-4 pt-4">
        <div className="grid gap-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="api-url" className="text-right">
              API基础URL
            </Label>
            <Input id="api-url" placeholder="https://api.example.com/v1" className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="api-auth-type" className="text-right">
              认证方式
            </Label>
            <Select defaultValue="bearer">
              <SelectTrigger id="api-auth-type" className="col-span-3">
                <SelectValue placeholder="选择认证方式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">无认证</SelectItem>
                <SelectItem value="basic">Basic认证</SelectItem>
                <SelectItem value="bearer">Bearer Token</SelectItem>
                <SelectItem value="apikey">API Key</SelectItem>
                <SelectItem value="oauth2">OAuth 2.0</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="api-token" className="text-right">
              Token
            </Label>
            <Input id="api-token" placeholder="Bearer Token" className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="api-headers" className="text-right">
              自定义请求头
            </Label>
            <Textarea
              id="api-headers"
              placeholder="Content-Type: application/json&#10;Accept: application/json"
              className="col-span-3"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={handleTestConnection} disabled={testStatus === "testing"}>
              {testStatus === "testing" ? (
                <>
                  <TestTube className="mr-2 h-4 w-4 animate-spin" />
                  测试中...
                </>
              ) : testStatus === "success" ? (
                <>
                  <TestTube className="mr-2 h-4 w-4 text-green-500" />
                  测试连接
                </>
              ) : testStatus === "error" ? (
                <>
                  <TestTube className="mr-2 h-4 w-4 text-red-500" />
                  测试连接
                </>
              ) : (
                <>
                  <TestTube className="mr-2 h-4 w-4" />
                  测试连接
                </>
              )}
            </Button>
            <Button>保存配置</Button>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="file" className="space-y-4 pt-4">
        <div className="grid gap-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="file-type" className="text-right">
              文件类型
            </Label>
            <Select defaultValue="csv">
              <SelectTrigger id="file-type" className="col-span-3">
                <SelectValue placeholder="选择文件类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="xml">XML</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="file-location" className="text-right">
              文件位置
            </Label>
            <Select defaultValue="sftp">
              <SelectTrigger id="file-location" className="col-span-3">
                <SelectValue placeholder="选择文件位置" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="local">本地文件</SelectItem>
                <SelectItem value="sftp">SFTP服务器</SelectItem>
                <SelectItem value="s3">Amazon S3</SelectItem>
                <SelectItem value="oss">阿里云OSS</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="file-host" className="text-right">
              服务器地址
            </Label>
            <Input id="file-host" placeholder="sftp.example.com" className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="file-path" className="text-right">
              文件路径
            </Label>
            <Input id="file-path" placeholder="/data/exports/" className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="file-user" className="text-right">
              用户名
            </Label>
            <Input id="file-user" placeholder="ftpuser" className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="file-password" className="text-right">
              密码
            </Label>
            <Input id="file-password" type="password" placeholder="••••••••" className="col-span-3" />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={handleTestConnection} disabled={testStatus === "testing"}>
              {testStatus === "testing" ? (
                <>
                  <TestTube className="mr-2 h-4 w-4 animate-spin" />
                  测试中...
                </>
              ) : testStatus === "success" ? (
                <>
                  <TestTube className="mr-2 h-4 w-4 text-green-500" />
                  测试连接
                </>
              ) : testStatus === "error" ? (
                <>
                  <TestTube className="mr-2 h-4 w-4 text-red-500" />
                  测试连接
                </>
              ) : (
                <>
                  <TestTube className="mr-2 h-4 w-4" />
                  测试连接
                </>
              )}
            </Button>
            <Button>保存配置</Button>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="erp" className="space-y-4 pt-4">
        <div className="grid gap-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="erp-type" className="text-right">
              ERP系统类型
            </Label>
            <Select defaultValue="sap">
              <SelectTrigger id="erp-type" className="col-span-3">
                <SelectValue placeholder="选择ERP系统类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sap">SAP</SelectItem>
                <SelectItem value="oracle">Oracle EBS</SelectItem>
                <SelectItem value="kingdee">金蝶</SelectItem>
                <SelectItem value="yonyou">用友</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="erp-url" className="text-right">
              服务地址
            </Label>
            <Input id="erp-url" placeholder="https://erp.example.com/api" className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="erp-client-id" className="text-right">
              客户端ID
            </Label>
            <Input id="erp-client-id" placeholder="client_id" className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="erp-client-secret" className="text-right">
              客户端密钥
            </Label>
            <Input id="erp-client-secret" type="password" placeholder="••••••••" className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="erp-username" className="text-right">
              用户名
            </Label>
            <Input id="erp-username" placeholder="admin" className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="erp-password" className="text-right">
              密码
            </Label>
            <Input id="erp-password" type="password" placeholder="••••••••" className="col-span-3" />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={handleTestConnection} disabled={testStatus === "testing"}>
              {testStatus === "testing" ? (
                <>
                  <TestTube className="mr-2 h-4 w-4 animate-spin" />
                  测试中...
                </>
              ) : testStatus === "success" ? (
                <>
                  <TestTube className="mr-2 h-4 w-4 text-green-500" />
                  测试连接
                </>
              ) : testStatus === "error" ? (
                <>
                  <TestTube className="mr-2 h-4 w-4 text-red-500" />
                  测试连接
                </>
              ) : (
                <>
                  <TestTube className="mr-2 h-4 w-4" />
                  测试连接
                </>
              )}
            </Button>
            <Button>保存配置</Button>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}
