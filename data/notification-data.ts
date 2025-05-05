// 模拟通知数据
export const mockNotifications = [
  {
    id: "1",
    title: "系统维护通知",
    content:
      "尊敬的用户，系统将于2023年5月15日凌晨2:00-4:00进行例行维护，期间部分功能可能暂时无法使用。给您带来的不便，敬请谅解。",
    type: "系统",
    time: "2023-05-10 10:30",
    read: false,
    important: true,
    category: "维护",
  },
  {
    id: "2",
    title: "绩效评估任务已分配",
    content: "您有一项新的绩效评估任务需要完成。请在2023年5月20日前完成团队成员的季度绩效评估。",
    type: "任务",
    time: "2023-05-09 14:15",
    read: false,
    important: true,
    category: "绩效",
    sender: {
      name: "张经理",
      title: "人力资源部",
      avatar: "/user-avatar.png",
    },
    actions: [
      {
        label: "立即处理",
        primary: true,
      },
      {
        label: "稍后提醒",
      },
    ],
  },
  {
    id: "3",
    title: "预算审核会议提醒",
    content: "提醒您，明天上午10:00将在会议室A举行Q2预算审核会议，请准时参加。",
    type: "日程",
    time: "2023-05-08 09:00",
    read: true,
    important: false,
    category: "会议",
    sender: {
      name: "李秘书",
      title: "行政部",
      avatar: "/user-avatar.png",
    },
    actions: [
      {
        label: "确认参加",
        primary: true,
      },
      {
        label: "无法参加",
      },
    ],
  },
  {
    id: "4",
    title: "新员工入职提醒",
    content: "王小明将于下周一(2023年5月15日)入职技术部，请做好相关准备工作。",
    type: "提醒",
    time: "2023-05-07 16:45",
    read: true,
    important: false,
    category: "入职",
    sender: {
      name: "赵HR",
      title: "人力资源部",
      avatar: "/user-avatar.png",
    },
  },
  {
    id: "5",
    title: "系统安全警告",
    content:
      "检测到您的账号在非常规时间段(2023年5月6日凌晨3:15)有登录尝试，IP地址为192.168.1.1，如非本人操作，请立即修改密码。",
    type: "警告",
    time: "2023-05-06 08:30",
    read: false,
    important: true,
    category: "安全",
    actions: [
      {
        label: "修改密码",
        primary: true,
      },
      {
        label: "确认是我",
      },
    ],
  },
  {
    id: "6",
    title: "薪资单已发放",
    content: "您的2023年4月薪资单已发放，请查收。如有疑问，请联系人力资源部。",
    type: "系统",
    time: "2023-05-05 10:00",
    read: true,
    important: false,
    category: "薪资",
    attachments: [
      {
        name: "2023年4月薪资单.pdf",
        size: "256 KB",
        url: "#",
      },
    ],
  },
  {
    id: "7",
    title: "培训课程邀请",
    content: "诚邀您参加“高效沟通技巧”培训课程，时间：2023年5月25日 14:00-16:00，地点：培训室B。",
    type: "日程",
    time: "2023-05-04 11:20",
    read: true,
    important: false,
    category: "培训",
    sender: {
      name: "培训部",
      avatar: "/user-avatar.png",
    },
    actions: [
      {
        label: "报名参加",
        primary: true,
      },
      {
        label: "查看详情",
      },
    ],
  },
  {
    id: "8",
    title: "项目进度更新",
    content: "数字化转型项目已完成70%，请各部门负责人及时更新剩余任务的进度计划。",
    type: "任务",
    time: "2023-05-03 15:40",
    read: true,
    important: true,
    category: "项目",
    sender: {
      name: "项目管理办公室",
      avatar: "/user-avatar.png",
    },
    attachments: [
      {
        name: "项目进度报告.xlsx",
        size: "1.2 MB",
        url: "#",
      },
      {
        name: "任务分配表.docx",
        size: "845 KB",
        url: "#",
      },
    ],
  },
  {
    id: "9",
    title: "系统功能更新",
    content: "数字驾驶舱平台已更新至v2.5.0版本，新增数据分析模块和移动端适配功能，欢迎体验。",
    type: "系统",
    time: "2023-05-02 09:15",
    read: true,
    important: false,
    category: "更新",
    actions: [
      {
        label: "查看更新详情",
        primary: true,
      },
    ],
  },
  {
    id: "10",
    title: "假期申请已批准",
    content: "您的2023年5月30日至6月2日的休假申请已获批准。",
    type: "提醒",
    time: "2023-05-01 14:00",
    read: true,
    important: false,
    category: "假期",
    sender: {
      name: "张经理",
      title: "部门主管",
      avatar: "/user-avatar.png",
    },
  },
]
