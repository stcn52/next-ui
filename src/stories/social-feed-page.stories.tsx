/**
 * Social Feed Page — 社交动态流页面，展示 Avatar、Badge、Card、Button、Textarea 的综合使用。
 */
import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import {
  HeartIcon,
  MessageCircleIcon,
  Share2Icon,
  BookmarkIcon,
  MoreHorizontalIcon,
  ImageIcon,
  SmileIcon,
  SendIcon,
  TrendingUpIcon,
  HashIcon,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/display/avatar"
import { Badge } from "@/components/ui/display/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/display/card"
import { Textarea } from "@/components/ui/inputs/textarea"
import { Separator } from "@/components/ui/display/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/overlays/dropdown-menu"

const meta: Meta = {
  title: "Pages/SocialFeedPage",
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

interface Post {
  id: string
  author: string
  handle: string
  avatar: string
  time: string
  content: string
  image?: string
  tags?: string[]
  likes: number
  comments: number
  shares: number
  liked?: boolean
  bookmarked?: boolean
}

const INITIAL_POSTS: Post[] = [
  {
    id: "1",
    author: "陈阳",
    handle: "chenyang",
    avatar: "",
    time: "2 分钟前",
    content:
      "刚刚发布了 @stcn52/next-ui v0.2.4 🎉 新增 DateRangePicker、FileUpload、ReportPage、OnboardingPage，单元测试现在达到 136 个！欢迎大家 star ⭐",
    tags: ["React", "UI", "开源"],
    likes: 48,
    comments: 12,
    shares: 7,
    liked: true,
  },
  {
    id: "2",
    author: "设计师小李",
    handle: "li_design",
    avatar: "",
    time: "1 小时前",
    content:
      "Tailwind CSS v4 的新特性真的太香了！原生 CSS 变量 + cascade layer，再也不用写一堆自定义配置。配合 shadcn/ui v3 使用体验极佳。",
    tags: ["Tailwind", "CSS", "前端"],
    likes: 134,
    comments: 23,
    shares: 19,
  },
  {
    id: "3",
    author: "前端架构师",
    handle: "arch_fe",
    avatar: "",
    time: "3 小时前",
    content:
      "分享一个性能优化实践：虚拟滚动（Virtual Scroll）很好，但要记得给可见行上下加 paddingTop/paddingBottom 占位行，否则会有闪屏问题。@tanstack/virtual 的文档里有这个细节，很多人踩坑。",
    tags: ["性能优化", "虚拟滚动"],
    likes: 267,
    comments: 45,
    shares: 38,
    bookmarked: true,
  },
  {
    id: "4",
    author: "全栈小王",
    handle: "fullstack_wang",
    avatar: "",
    time: "昨天",
    content:
      "React 19 的 Server Actions 结合 Next.js App Router 真的改变了我的开发方式。表单提交再也不需要手写 fetch + 状态管理那套了。",
    tags: ["React19", "NextJS"],
    likes: 89,
    comments: 17,
    shares: 11,
  },
]

const TRENDING_TAGS = [
  { tag: "React19", posts: 1284 },
  { tag: "TailwindCSS", posts: 987 },
  { tag: "TypeScript", posts: 745 },
  { tag: "shadcnUI", posts: 432 },
  { tag: "开源项目", posts: 318 },
]

const SUGGESTED_USERS = [
  { name: "Vue 官方", handle: "vuejs", followers: "240k" },
  { name: "Vercel", handle: "vercel", followers: "189k" },
  { name: "Tailwind", handle: "tailwindcss", followers: "156k" },
]

// ---------------------------------------------------------------------------
// Post card
// ---------------------------------------------------------------------------

function PostCard({ post }: { post: Post }) {
  const [liked, setLiked] = useState(post.liked ?? false)
  const [bookmarked, setBookmarked] = useState(post.bookmarked ?? false)
  const [likeCount, setLikeCount] = useState(post.likes)

  const handleLike = () => {
    setLiked((prev) => !prev)
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1))
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="size-9">
              <AvatarImage src={post.avatar} />
              <AvatarFallback className="text-sm">{post.author[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold leading-none">{post.author}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">@{post.handle} · {post.time}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" className="-mr-1 text-muted-foreground"><MoreHorizontalIcon className="size-4" /></Button>} />
            <DropdownMenuContent align="end">
              <DropdownMenuItem>复制链接</DropdownMenuItem>
              <DropdownMenuItem>举报</DropdownMenuItem>
              <DropdownMenuItem>屏蔽 @{post.handle}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm leading-relaxed">{post.content}</p>
        {post.tags && (
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" size="sm" className="cursor-pointer">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
        <Separator />
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className={liked ? "text-red-500 hover:text-red-400" : "text-muted-foreground"}
              onClick={handleLike}
            >
              <HeartIcon className={liked ? "fill-current" : ""} />
              {likeCount}
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <MessageCircleIcon />
              {post.comments}
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <Share2Icon />
              {post.shares}
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            className={bookmarked ? "text-primary" : "text-muted-foreground"}
            onClick={() => setBookmarked((p) => !p)}
          >
            <BookmarkIcon className={bookmarked ? "fill-current" : ""} />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// Compose box
// ---------------------------------------------------------------------------

function ComposeBox() {
  const [text, setText] = useState("")
  return (
    <Card>
      <CardContent className="pt-4 space-y-3">
        <div className="flex gap-3">
          <Avatar className="size-9 shrink-0">
            <AvatarFallback>我</AvatarFallback>
          </Avatar>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="分享你的想法…"
            className="min-h-[72px] resize-none border-0 bg-transparent p-0 shadow-none focus-visible:ring-0 text-sm"
          />
        </div>
        <div className="flex items-center justify-between border-t pt-3">
          <div className="flex gap-1">
            <Button variant="ghost" size="icon-sm" className="text-muted-foreground">
              <ImageIcon className="size-4" />
            </Button>
            <Button variant="ghost" size="icon-sm" className="text-muted-foreground">
              <SmileIcon className="size-4" />
            </Button>
          </div>
          <Button size="sm" disabled={!text.trim()}>
            <SendIcon />
            发布
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

function SocialFeedPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-background px-6 py-4 sticky top-0 z-10">
        <h1 className="text-xl font-semibold">动态</h1>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-5">
        <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
          {/* Feed */}
          <div className="space-y-4">
            <ComposeBox />
            {INITIAL_POSTS.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Trending */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <TrendingUpIcon className="size-4 text-primary" />
                  <h3 className="text-sm font-semibold">热门话题</h3>
                </div>
              </CardHeader>
              <CardContent className="space-y-1">
                {TRENDING_TAGS.map((item, i) => (
                  <button
                    key={item.tag}
                    type="button"
                    className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-accent"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-3">{i + 1}</span>
                      <div>
                        <p className="font-medium">
                          <HashIcon className="inline size-3 mr-0.5" />
                          {item.tag}
                        </p>
                        <p className="text-xs text-muted-foreground">{item.posts} 条帖子</p>
                      </div>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Suggested users */}
            <Card>
              <CardHeader className="pb-2">
                <h3 className="text-sm font-semibold">推荐关注</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                {SUGGESTED_USERS.map((user) => (
                  <div key={user.handle} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <Avatar className="size-8 shrink-0">
                        <AvatarFallback className="text-xs">{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground">@{user.handle} · {user.followers}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="xs" className="shrink-0">
                      关注
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export const Default: Story = {
  render: () => <SocialFeedPage />,
}
