"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

export function SyncSettings() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">同步频率</h3>
        <RadioGroup defaultValue="scheduled">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="manual" id="manual" />
            <Label htmlFor="manual">手动同步</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="scheduled" id="scheduled" />
            <Label htmlFor="scheduled">定时同步</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="realtime" id="realtime" />
            <Label htmlFor="realtime">实时同步</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium">定时设置</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="frequency">频率</Label>
            <Select defaultValue="daily">
              <SelectTrigger id="frequency">
                <SelectValue placeholder="选择频率" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">每小时</SelectItem>
                <SelectItem value="daily">每天</SelectItem>
                <SelectItem value="weekly">每周</SelectItem>
                <SelectItem value="monthly">每月</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="time">时间</Label>
            <Input id="time" type="time" defaultValue="03:00" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium">同步数据范围</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="employees" defaultChecked />
            <Label htmlFor="employees">员工数据</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="departments" defaultChecked />
            <Label htmlFor="departments">部门数据</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="performance" defaultChecked />
            <Label htmlFor="performance">绩效数据</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="salary" defaultChecked />
            <Label htmlFor="salary">薪资数据</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="attendance" />
            <Label htmlFor="attendance">考勤数据</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="training" />
            <Label htmlFor="training">培训数据</Label>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium">高级设置</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="incremental">增量同步</Label>
            <Switch id="incremental" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="conflict">冲突时覆盖本地数据</Label>
            <Switch id="conflict" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="notification">同步完成后发送通知</Label>
            <Switch id="notification" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="error-retry">错误自动重试</Label>
            <Switch id="error-retry" defaultChecked />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button>保存设置</Button>
      </div>
    </div>
  )
}
