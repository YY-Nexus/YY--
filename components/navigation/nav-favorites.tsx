"use client"

import { useNavFavorites } from "@/hooks/use-nav-favorites"
import { useNavigation } from "@/hooks/use-navigation"
import { cn } from "@/lib/utils"
import { Star, GripVertical, Plus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { navigationData, type NavItemType } from "@/lib/navigation-data"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"

export function NavFavorites() {
  const { favorites, removeFromFavorites, reorderFavorites } = useNavFavorites()
  const { isExpanded } = useNavigation()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // 处理拖放
  const handleDragEnd = (result: any) => {
    if (!result.destination) return
    reorderFavorites(result.source.index, result.destination.index)
  }

  if (!isExpanded && favorites.length === 0) return null

  return (
    <div className="space-y-2 px-3 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center text-sm font-medium text-muted-foreground">
          <Star className="mr-1 h-3.5 w-3.5" />
          <span>我的收藏</span>
        </div>
        {isExpanded && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-5 w-5">
                <Plus className="h-3 w-3" />
                <span className="sr-only">添加收藏</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>添加到收藏</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Input
                  placeholder="搜索功能..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
                <div className="max-h-[300px] overflow-y-auto space-y-1">
                  {searchQuery === ""
                    ? navigationData.map((item) => (
                        <NavFavoriteItem key={item.id} item={item} onClose={() => setIsDialogOpen(false)} />
                      ))
                    : navigationData
                        .flatMap((item) => [
                          item,
                          ...(item.children || []).map((child) => ({ ...child, parent: item })),
                        ])
                        .filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map((item) => (
                          <NavFavoriteItem
                            key={item.id}
                            item={item}
                            parentTitle={item.parent?.title}
                            onClose={() => setIsDialogOpen(false)}
                          />
                        ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {favorites.length > 0 ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="favorites">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-1">
                {favorites.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided) => (
                        <motion.div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          className="group relative"
                        >
                          <Link
                            href={item.path}
                            className={cn(
                              "flex items-center rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-muted hover:text-foreground",
                              !isExpanded && "justify-center px-0",
                            )}
                          >
                            {isExpanded && (
                              <div
                                {...provided.dragHandleProps}
                                className="mr-1 cursor-grab opacity-0 group-hover:opacity-100"
                              >
                                <GripVertical className="h-3 w-3" />
                              </div>
                            )}
                            <Icon className={cn("h-3.5 w-3.5", isExpanded && "mr-2")} />
                            {isExpanded && (
                              <>
                                <span className="flex-1 truncate">{item.title}</span>
                                {item.parentTitle && (
                                  <span className="ml-1 text-xs text-muted-foreground">({item.parentTitle})</span>
                                )}
                              </>
                            )}
                          </Link>

                          {isExpanded && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                removeFromFavorites(item.id)
                              }}
                            >
                              <Star className="h-3 w-3 fill-current" />
                              <span className="sr-only">取消收藏</span>
                            </Button>
                          )}
                        </motion.div>
                      )}
                    </Draggable>
                  )
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        isExpanded && <div className="text-center py-2 text-sm text-muted-foreground">暂无收藏，点击 + 添加</div>
      )}
    </div>
  )
}

function NavFavoriteItem({
  item,
  parentTitle,
  onClose,
}: {
  item: NavItemType & { parent?: NavItemType }
  parentTitle?: string
  onClose: () => void
}) {
  const { addToFavorites, isFavorite } = useNavFavorites()
  const Icon = item.icon

  const handleAddToFavorites = () => {
    addToFavorites(item, parentTitle || item.parent?.title)
    onClose()
  }

  const alreadyFavorited = isFavorite(item.id)

  return (
    <div className="flex items-center justify-between rounded-md px-2 py-1 hover:bg-muted">
      <div className="flex items-center">
        <Icon className="mr-2 h-4 w-4" />
        <span>{item.title}</span>
        {(parentTitle || item.parent?.title) && (
          <span className="ml-1 text-xs text-muted-foreground">({parentTitle || item.parent?.title})</span>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={handleAddToFavorites}
        disabled={alreadyFavorited}
      >
        <Star className={cn("h-3 w-3", alreadyFavorited && "fill-yellow-400")} />
        <span className="sr-only">添加到收藏</span>
      </Button>
    </div>
  )
}
