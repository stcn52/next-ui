export interface UserItem {
  id: string
  name: string
  email: string
  role: "admin" | "editor" | "viewer"
  status: "active" | "inactive"
  lastLogin: string
}

export const USERS: UserItem[] = [
  { id: "1", name: "张三", email: "zhangsan@example.com", role: "admin", status: "active", lastLogin: "2025-01-15 10:30" },
  { id: "2", name: "李四", email: "lisi@example.com", role: "editor", status: "active", lastLogin: "2025-01-14 16:45" },
  { id: "3", name: "王五", email: "wangwu@example.com", role: "viewer", status: "inactive", lastLogin: "2025-01-10 09:00" },
  { id: "4", name: "赵六", email: "zhaoliu@example.com", role: "editor", status: "active", lastLogin: "2025-01-15 08:20" },
  { id: "5", name: "孙七", email: "sunqi@example.com", role: "viewer", status: "active", lastLogin: "2025-01-13 14:10" },
  { id: "6", name: "周八", email: "zhouba@example.com", role: "admin", status: "active", lastLogin: "2025-01-15 11:05" },
  { id: "7", name: "吴九", email: "wujiu@example.com", role: "viewer", status: "inactive", lastLogin: "2024-12-20 07:30" },
  { id: "8", name: "郑十", email: "zhengshi@example.com", role: "editor", status: "active", lastLogin: "2025-01-14 20:15" },
]
