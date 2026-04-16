/**
 * User Profile Page — 用户主页：头像/简介/动态/关注统计
 */
import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import {
  MapPinIcon,
  LinkIcon,
  CalendarDaysIcon,
  StarIcon,
  BookOpenIcon,
  HeartIcon,
  MessageSquareIcon,
  EditIcon,
  MoreHorizontalIcon,
  UserPlusIcon,
  BellIcon,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const meta: Meta = {
  title: "Pages/UserProfilePage",
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj

// ─── Data ─────────────────────────────────────────────────────────────────────

const USER = {
  name: "陈宇",
  username: "chenyu",
  avatar: "",
  bio: "前端工程师 | React / TypeScript / Tailwind 爱好者。开源贡献者，热衷于组件库与设计系统。",
  location: "北京，中国",
  website: "https://chenyu.dev",
  joinedAt: "2022年 3月",
  followers: 1284,
  following: 318,
  stars: 4720,
}

const POSTS = [
  { id: "1", title: "React 19 并发特性深入解析", date: "2024-12-08", likes: 147, comments: 23, tags: ["React", "性能"] },
  { id: "2", title: "Tailwind CSS v4 设计令牌体系", date: "2024-12-05", likes: 98, comments: 14, tags: ["Tailwind", "CSS"] },
  { id: "3", title: "虚拟滚动列表性能优化实战", date: "2024-11-20", likes: 72, comments: 9, tags: ["性能", "React"] },
]

const LIKED_POSTS = [
  { id: "a", title: "TypeScript 类型体操：实用工具类型", author: "刘洋", date: "2024-11-05", likes: 234 },
  { id: "b", title: "Playwright E2E 测试最佳实践", author: "李娜", date: "2024-11-12", likes: 189 },
]

const FOLLOWERS_SAMPLE = [
  { name: "张伟", username: "zhangwei", bio: "全栈工程师" },
  { name: "王芳", username: "wangfang", bio: "UI/UX 设计师" },
  { name: "陈静", username: "chenjing", bio: "后端开发 · Golang" },
  { name: "刘洋", username: "liuyang", bio: "DevOps 工程师" },
]

// ─── Sub-components ────────────────────────────────────────────────────────────

function PostCard({ post }: { post: (typeof POSTS)[0] }) {
  return (
    <Card className="hover:shadow-sm transition-shadow cursor-pointer">
      <CardContent className="p-4 space-y-2">
        <h3 className="font-medium text-sm leading-snug">{post.title}</h3>
        <div className="flex items-center gap-2 flex-wrap">
          {post.tags.map((t) => (
            <Badge key={t} variant="secondary" size="sm">{t}</Badge>
          ))}
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
          <span className="flex items-center gap-1"><HeartIcon className="size-3" />{post.likes}</span>
          <span className="flex items-center gap-1"><MessageSquareIcon className="size-3" />{post.comments}</span>
          <span className="flex items-center gap-1"><CalendarDaysIcon className="size-3" />{post.date}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function LikedPostCard({ post }: { post: (typeof LIKED_POSTS)[0] }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b last:border-0">
      <HeartIcon className="size-4 text-pink-500 mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-snug">{post.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          by {post.author} · {post.date} · {post.likes} 赞
        </p>
      </div>
    </div>
  )
}

function FollowerCard({ user }: { user: (typeof FOLLOWERS_SAMPLE)[0] }) {
  const [following, setFollowing] = useState(false)
  return (
    <div className="flex items-center gap-3 py-2.5 border-b last:border-0">
      <Avatar className="size-9">
        <AvatarFallback className="text-xs">{user.name.slice(0, 2)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{user.name}</p>
        <p className="text-xs text-muted-foreground">@{user.username} · {user.bio}</p>
      </div>
      <Button
        variant={following ? "outline" : "default"}
        size="xs"
        onClick={() => setFollowing((f) => !f)}
      >
        {following ? "已关注" : "关注"}
      </Button>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function UserProfilePage({ isOwner = false }: { isOwner?: boolean }) {
  const [followed, setFollowed] = useState(false)
  const [followers, setFollowers] = useState(USER.followers)

  return (
    <div className="min-h-screen bg-background">
      {/* Cover */}
      <div className="h-36 bg-gradient-to-r from-primary/30 via-primary/10 to-background" />

      <div className="max-w-2xl mx-auto px-5 pb-10">
        {/* Avatar + Actions */}
        <div className="flex items-end justify-between -mt-12 mb-4">
          <Avatar className="size-20 border-4 border-background shadow-md">
            {USER.avatar && <AvatarImage src={USER.avatar} />}
            <AvatarFallback className="text-2xl">{USER.name.slice(0, 1)}</AvatarFallback>
          </Avatar>

          <div className="flex items-center gap-2 pb-1">
            {isOwner ? (
              <>
                <Button variant="outline" size="sm">
                  <EditIcon className="size-3.5" />
                  编辑资料
                </Button>
                <Button variant="outline" size="icon-sm"><MoreHorizontalIcon className="size-4" /></Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="icon-sm" aria-label="订阅通知">
                  <BellIcon className="size-4" />
                </Button>
                <Button
                  variant={followed ? "outline" : "default"}
                  size="sm"
                  onClick={() => {
                    setFollowed((f) => !f)
                    setFollowers((c) => (followed ? c - 1 : c + 1))
                  }}
                >
                  <UserPlusIcon className="size-3.5" />
                  {followed ? "已关注" : "关注"}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-1.5 mb-4">
          <h1 className="text-xl font-bold">{USER.name}</h1>
          <p className="text-sm text-muted-foreground">@{USER.username}</p>
          <p className="text-sm">{USER.bio}</p>
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-2">
            <span className="flex items-center gap-1"><MapPinIcon className="size-3.5" />{USER.location}</span>
            <span className="flex items-center gap-1"><LinkIcon className="size-3.5" />{USER.website}</span>
            <span className="flex items-center gap-1"><CalendarDaysIcon className="size-3.5" />加入于 {USER.joinedAt}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-5 text-sm mb-5">
          {[
            { label: "粉丝", value: followers },
            { label: "关注", value: USER.following },
            { label: "获赞", value: USER.stars, icon: StarIcon },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center gap-1">
              <strong className="font-bold">{value.toLocaleString()}</strong>
              <span className="text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>

        <Separator className="mb-5" />

        {/* Tabs */}
        <Tabs defaultValue="posts">
          <TabsList className="mb-4">
            <TabsTrigger value="posts" className="gap-1.5"><BookOpenIcon className="size-3.5" />文章</TabsTrigger>
            <TabsTrigger value="liked" className="gap-1.5"><HeartIcon className="size-3.5" />点赞</TabsTrigger>
            <TabsTrigger value="followers" className="gap-1.5"><UserPlusIcon className="size-3.5" />粉丝</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-3">
            {POSTS.map((p) => <PostCard key={p.id} post={p} />)}
          </TabsContent>

          <TabsContent value="liked">
            {LIKED_POSTS.map((p) => <LikedPostCard key={p.id} post={p} />)}
          </TabsContent>

          <TabsContent value="followers">
            {FOLLOWERS_SAMPLE.map((u) => <FollowerCard key={u.username} user={u} />)}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export const Visitor: Story = { render: () => <UserProfilePage /> }
export const Owner: Story = { render: () => <UserProfilePage isOwner /> }
