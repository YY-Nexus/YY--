"use client"

import { useState } from "react"
import {
  Search,
  Calendar,
  Eye,
  ThumbsUp,
  MessageSquare,
  CheckCircle,
  Clock,
  Tag,
  Github,
  FileText,
  Video,
  Code,
  BookOpen,
  FileQuestion,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DeveloperCommunityProps {
  className?: string
}

export function DeveloperCommunity({ className }: DeveloperCommunityProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("resources")
  const [resourceType, setResourceType] = useState("all")
  const [forumCategory, setForumCategory] = useState("all")

  // 模拟资源数据
  const resources = [
    {
      id: "res-001",
      title: "API集成指南",
      type: "documentation",
      description: "全面的API文档和集成指南，包含详细示例和最佳实践",
      author: "技术团队",
      date: "2024-04-10",
      views: 3250,
      likes: 187,
      tags: ["API", "集成", "文档"],
      url: "#",
    },
    {
      id: "res-002",
      title: "插件开发入门",
      type: "tutorial",
      description: "从零开始学习如何开发自定义插件，包括开发环境搭建和基本概念",
      author: "张开发",
      date: "2024-03-28",
      views: 1876,
      likes: 142,
      tags: ["插件开发", "教程", "入门"],
      url: "#",
    },
    {
      id: "res-003",
      title: "数据可视化插件开发视频教程",
      type: "video",
      description: "通过视频学习如何创建高级数据可视化插件，包括交互式图表和动画效果",
      author: "李数据",
      date: "2024-04-05",
      views: 2150,
      likes: 198,
      tags: ["视频教程", "数据可视化", "插件开发"],
      url: "#",
      duration: "1小时25分钟",
    },
    {
      id: "res-004",
      title: "插件开发模板库",
      type: "code",
      description: "各种类型插件的开发模板和示例代码，帮助快速启动新项目",
      author: "开源社区",
      date: "2024-03-15",
      views: 1560,
      likes: 210,
      tags: ["模板", "代码", "开源"],
      url: "#",
      github: "https://github.com/example/plugin-templates",
    },
    {
      id: "res-005",
      title: "数据连接器开发指南",
      type: "documentation",
      description: "学习如何开发连接各种数据源的自定义连接器，包括认证和数据转换",
      author: "技术团队",
      date: "2024-02-20",
      views: 1890,
      likes: 156,
      tags: ["数据连接器", "集成", "文档"],
      url: "#",
    },
    {
      id: "res-006",
      title: "插件安全最佳实践",
      type: "guide",
      description: "保护您的插件和用户数据的安全最佳实践和指南",
      author: "安全团队",
      date: "2024-04-15",
      views: 1250,
      likes: 132,
      tags: ["安全", "最佳实践", "指南"],
      url: "#",
    },
    {
      id: "res-007",
      title: "插件UI组件库",
      type: "code",
      description: "一套专为插件设计的UI组件库，包含各种常用界面元素",
      author: "UI设计团队",
      date: "2024-03-10",
      views: 2100,
      likes: 245,
      tags: ["UI", "组件", "设计"],
      url: "#",
      github: "https://github.com/example/plugin-ui-components",
    },
    {
      id: "res-008",
      title: "插件性能优化技巧",
      type: "tutorial",
      description: "学习如何优化插件性能，提高响应速度和用户体验",
      author: "性能专家",
      date: "2024-04-02",
      views: 1450,
      likes: 168,
      tags: ["性能优化", "教程", "最佳实践"],
      url: "#",
    },
  ]

  // 模拟论坛帖子数据
  const forumPosts = [
    {
      id: "post-001",
      title: "如何解决API认证问题？",
      category: "help",
      author: {
        name: "问题解决者",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      date: "2024-04-18",
      replies: 12,
      views: 345,
      solved: true,
      lastActivity: "2024-04-20",
      tags: ["API", "认证", "问题"],
    },
    {
      id: "post-002",
      title: "分享我开发的数据导出插件",
      category: "showcase",
      author: {
        name: "创新开发",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      date: "2024-04-15",
      replies: 8,
      views: 230,
      solved: false,
      lastActivity: "2024-04-19",
      tags: ["插件", "数据导出", "分享"],
    },
    {
      id: "post-003",
      title: "插件开发框架v2.0发布公告",
      category: "announcement",
      author: {
        name: "官方团队",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      date: "2024-04-10",
      replies: 25,
      views: 780,
      solved: false,
      lastActivity: "2024-04-20",
      tags: ["公告", "框架", "更新"],
    },
    {
      id: "post-004",
      title: "自定义图表组件渲染问题",
      category: "help",
      author: {
        name: "图表专家",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      date: "2024-04-17",
      replies: 6,
      views: 185,
      solved: false,
      lastActivity: "2024-04-19",
      tags: ["图表", "渲染", "问题"],
    },
    {
      id: "post-005",
      title: "数据处理插件性能优化建议",
      category: "discussion",
      author: {
        name: "性能优化师",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      date: "2024-04-16",
      replies: 15,
      views: 320,
      solved: false,
      lastActivity: "2024-04-20",
      tags: ["性能", "优化", "讨论"],
    },
    {
      id: "post-006",
      title: "新版API文档错误报告",
      category: "bug",
      author: {
        name: "文档审核员",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      date: "2024-04-19",
      replies: 3,
      views: 120,
      solved: true,
      lastActivity: "2024-04-20",
      tags: ["文档", "错误", "报告"],
    },
  ]

  // 获取资源类型图标
  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case "documentation":
        return <FileText className="h-5 w-5 text-blue-500" />
      case "tutorial":
        return <BookOpen className="h-5 w-5 text-green-500" />
      case "video":
        return <Video className="h-5 w-5 text-red-500" />
      case "code":
        return <Code className="h-5 w-5 text-purple-500" />
      case "guide":
        return <FileQuestion className="h-5 w-5 text-amber-500" />
      default:
        return <FileText className="h-5 w-5 text-gray-500" />
    }
  }

  // 获取论坛分类徽章
  const getForumCategoryBadge = (category: string) => {
    switch (category) {
      case "help":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            求助
          </Badge>
        )
      case "showcase":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            展示
          </Badge>
        )
      case "announcement":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            公告
          </Badge>
        )
      case "discussion":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            讨论
          </Badge>
        )
      case "bug":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Bug
          </Badge>
        )
      default:
        return <Badge variant="outline">其他</Badge>
    }
  }

  // 筛选资源
  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesType = resourceType === "all" || resource.type === resourceType

    return matchesSearch && matchesType
  })

  // 筛选论坛帖子
  const filteredForumPosts = forumPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = forumCategory === "all" || post.category === forumCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">开发者社区</h2>
        <p className="text-muted-foreground">探索开发资源、参与讨论，与其他开发者交流分享</p>
      </div>

      {/* 搜索和筛选 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="搜索资源和讨论..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {activeTab === "resources" ? (
          <Select value={resourceType} onValueChange={setResourceType}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="资源类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部类型</SelectItem>
              <SelectItem value="documentation">文档</SelectItem>
              <SelectItem value="tutorial">教程</SelectItem>
              <SelectItem value="video">视频</SelectItem>
              <SelectItem value="code">代码</SelectItem>
              <SelectItem value="guide">指南</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <Select value={forumCategory} onValueChange={setForumCategory}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="论坛分类" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部分类</SelectItem>
              <SelectItem value="help">求助</SelectItem>
              <SelectItem value="showcase">展示</SelectItem>
              <SelectItem value="announcement">公告</SelectItem>
              <SelectItem value="discussion">讨论</SelectItem>
              <SelectItem value="bug">Bug</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {/* 标签页 */}
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="resources">开发资源</TabsTrigger>
          <TabsTrigger value="forum">开发论坛</TabsTrigger>
        </TabsList>

        {/* 资源标签页内容 */}
        <TabsContent value="resources" className="mt-6">
          {filteredResources.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">没有找到匹配的资源</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredResources.map((resource) => (
                <Card key={resource.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      {getResourceTypeIcon(resource.type)}
                      <Badge variant="secondary" className="text-xs">
                        {resource.type === "documentation" && "文档"}
                        {resource.type === "tutorial" && "教程"}
                        {resource.type === "video" && "视频"}
                        {resource.type === "code" && "代码"}
                        {resource.type === "guide" && "指南"}
                      </Badge>
                      {resource.duration && (
                        <Badge variant="outline" className="ml-auto text-xs">
                          <Clock className="mr-1 h-3 w-3" />
                          {resource.duration}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg">
                      <a href={resource.url} className="hover:text-primary hover:underline">
                        {resource.title}
                      </a>
                    </CardTitle>
                    <CardDescription className="line-clamp-2">{resource.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex flex-wrap gap-1">
                      {resource.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between text-sm text-muted-foreground pt-2">
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-3 w-3" />
                      {resource.date}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center">
                        <Eye className="mr-1 h-3 w-3" />
                        {resource.views}
                      </span>
                      <span className="flex items-center">
                        <ThumbsUp className="mr-1 h-3 w-3" />
                        {resource.likes}
                      </span>
                      {resource.github && (
                        <a
                          href={resource.github}
                          className="flex items-center text-muted-foreground hover:text-primary"
                        >
                          <Github className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* 论坛标签页内容 */}
        <TabsContent value="forum" className="mt-6">
          {filteredForumPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">没有找到匹配的讨论</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredForumPosts.map((post) => (
                <Card key={post.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {getForumCategoryBadge(post.category)}
                          {post.solved && (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              已解决
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg">
                          <a href="#" className="hover:text-primary hover:underline">
                            {post.title}
                          </a>
                        </CardTitle>
                      </div>
                      <div className="flex flex-col items-end text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="mr-1 h-3 w-3" />
                          {post.date}
                        </div>
                        <div className="flex items-center mt-1">
                          <Clock className="mr-1 h-3 w-3" />
                          最近活动: {post.lastActivity}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex flex-wrap gap-1 mb-3">
                      {post.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <Tag className="mr-1 h-3 w-3" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
                        <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{post.author.name}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <MessageSquare className="mr-1 h-3 w-3" />
                        {post.replies} 回复
                      </span>
                      <span className="flex items-center">
                        <Eye className="mr-1 h-3 w-3" />
                        {post.views} 浏览
                      </span>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-6 flex justify-center">
            <Button>
              <MessageSquare className="mr-2 h-4 w-4" />
              发布新讨论
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
