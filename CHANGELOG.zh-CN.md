# 更新日志

## 0.3.0（2026-04-18）

### 新增功能

- 新增公开的 schema 驱动 `form-engine` 模块，底层基于 TanStack Form
- 新增规则判断、派生字段、字段联动、可重复分组、JSON 辅助工具和 Playground Story
- 新增 widget 注册能力，业务项目可以把自定义组件接入 schema 表单，而不需要 fork 现有输入组件

### 改进

- 为 ColorPicker、ChatSender、CommentEditor、日期/时间选择器、FileUpload、RichTextEditor 和多种输入原语补齐统一的 form-engine 字段绑定能力
- 扩展 `DataGrid`，新增复制、CSV 导出、重置视图，以及更稳定的电子表格式编辑行为

### 测试

- `pnpm exec vitest run src/__tests__/form-engine.test.ts src/__tests__/form-engine-render.test.tsx src/__tests__/form-engine-json.test.tsx`
- `pnpm exec vitest run src/__tests__/data-grid.test.tsx`

## 0.2.7（2026-04-17）

### 修复

- 压缩聊天、数据、日期、弹层、表单和文件上传等通用 UI 的边框、间距与视觉外壳，统一更紧凑的设计基线

### 测试

- `pnpm lint`
- `pnpm test`
- `pnpm build:lib`
- `pnpm test:e2e`

## 0.2.4（2026-04-17）

### 新增组件

- **DateRangePicker** — 弹出式日期范围选择器，基于 react-day-picker `mode="range"` + `Popover`，支持 i18n（zh-CN / en / ja-JP）
- **FileUpload** — 拖拽上传区，支持拖拽放置、点击选择、文件列表、进度条、错误状态、大小限制

### 新增页面模板

- **ReportPage** — KPI 卡片 + 渠道表格 + 产品表格 + DateRangePicker 日期过滤
- **OnboardingPage** — 4 步引导页，使用 Stepper，含资料表单 + 偏好开关

### 测试

- 新增 28 个单元测试（DateRangePicker 5 个 + FileUpload 23 个），总计 136 个测试

### compact-ui-review 审查

- **blog-page** — `space-y-6 p-6 → space-y-5 p-5`
- **pricing-page** — `mb-6 p-6 → mb-4 p-5`
- **chat-page 欢迎屏** — `gap-6 → gap-4`

## 0.2.3（2026-05-04）

### 优化

**compact-ui-review 全面扫描** — 系统性地对所有页面模板和复合组件进行间距压缩与配色规范化，遵循 [compact-ui-review SKILL.md v7](https://github.com/stcn52/next-ui/blob/main/.agents/skills/compact-ui-review/SKILL.md)。

#### 页面模板（story 层）
- **通知页 / 项目页** — 用 CSS border 模式替换条件式 `<Separator />`（§9.2 深度代替外边距）
- **团队页 / 订单页 / 收件箱 / FAQ / 日历 / 更新日志** — 页头 `py-5→py-4`，页面主体 `p-6→p-5`，间距 `gap-4→gap-3`，Separator 外边距缩减
- **分析页 / 仪表盘 / 文件管理 / 用户列表** — 主体 `p-6→p-5 space-y-6→space-y-5`，KPI 网格 `gap-4→gap-3`
- **认证 / 博客 / 定价 / 设置 / 个人资料** — 表单间距 `space-y-4→space-y-3`，节头距离缩减

#### UI 组件
- **ChatBubble** `BubbleList` — `gap-4→gap-3`
- **PromptLibrary** — 网格 `gap-4→gap-3`，变量列表 `space-y-4→space-y-3`
- **DataTable / VirtualDataTable / EditableDataTable** — 空状态单元格 `h-24→h-16`，根容器 `gap-4→gap-3`

#### Bug 修复
- **UserListPage** — 未激活状态圆点 `bg-gray-300→bg-border`（改善暗色模式对比度）

#### SKILL.md v7（361 行）
- §9 Apple HIG 空间设计原则（6 个子原则）
- §10 原子组件锁定名单（button/input/badge 等锁定，禁止审核）
- §11 配色与暗色模式审核规则（语义 token、`dark:` 模式、grep 命令）

### 数据
- 108 个单元测试全部通过
- 所有变更通过 lint + build 验证

---

## 0.2.2（2026-04-16）

### 优化

- **ChatSender 紧凑化重构** — 按 compact-ui-review（O1–O5）完成实施：
  - `Card > CardContent` 双层包裹改为单层 `div`（外观不变，减少一层 DOM）
  - 拖拽提示文字改为卡片内 `absolute` 遮罩；根容器不再因拖入而撑大
  - 附件卡片内边距加入 `densityStyles` 映射，compact/dense 模式下附件芯片真正变小
  - 删除 overlay 建议面板冗余标题行（"快捷提示 / N 条"——点击按钮后再看一次无信息增益）
  - 快捷提示（Lightbulb）按钮从 meta 行上移到输入行 leading 区域；meta 行去掉 `border-t`
  - 清理三处无引用的 `metaButtonSize` 字段
- **ChatBubble 紧凑化重构**：
  - 气泡内边距 `px-3.5 py-2.5` → `px-3 py-2`，对齐业界标准（iMessage、Claude web）
  - 助手消息宽度 `max-w-[75%]` → `max-w-[85%]`，减少代码块横向溢出
  - 编辑模式 textarea `min-h-20` → `min-h-16`，高度跳动感降低
  - 状态/动作行加空保卫——`timestamp`、sent 状态和所有 action 均缺席时不渲染该行
- **Sidebar 紧凑化重构**：
  - `SidebarHeader` / `SidebarFooter` 垂直内边距 `py-3` → `py-2`
  - `SidebarGroup` 垂直内边距 `py-2` → `py-1`，组间空白从约 44px 降至约 20px
  - `SidebarGroupLabel` 内边距 `py-1.5` → `py-1`；移除 `uppercase`（保留 `tracking-wider` 维持层级感）
  - `SidebarItem` 内边距 `py-1.5` → `py-1`，32px 触控目标，满足 WCAG 2.5.5 最低要求
- **compact-ui-review skill** 已写入 `.agents/skills/`，项目级可直接调用

---

## 0.2.1（2026-04-16）

### 新增功能

- **对话组件（Chat Components）** — 用于构建对话交互界面的可复用 UI 组件
  - `Bubble` — 消息气泡，支持多种变体（filled/outlined/shadow/borderless）
  - `BubbleList` — 消息流列表
  - `ChatSender` — 输入框，支持附件、@提及、快速回复、流式加载状态
  - `ChatConversations` — 分组对话列表，支持搜索
  - `ThoughtChain` — 可折叠的 AI 推理步骤
  - `TypingIndicator` — 动画"正在思考"指示器
  - `RichContent` — Markdown 代码块渲染

### 改进

- **React 警告修复** — 解决 ThoughtChain 和 DropdownMenuTrigger 的嵌套 button 问题
- **测试增强** — ChatConversations 测试中使用 `waitFor` 处理异步状态
- **E2E 覆盖扩展** — 新增 4 个对话相关 E2E 测试（sender、mentions、bubble variants、conversations）

### 测试

- 单元测试：88/88 通过（基础 49 + 对话 39）
- E2E 测试：22/22 通过（页面组合 18 + 对话 4）
- 全部 React 警告已解决

---

## 0.2.0（2026-04-16）

### 新增组件

- **Timeline（时间线）** — 支持垂直/水平布局，5 种圆点变体（默认/主色/成功/警告/危险），连接线
- **Stepper（步骤指示器）** — 支持水平/垂直方向，已完成/进行中/待定状态

### 新增页面模板

- **Blog（博客）** — 精选文章、标签筛选、阅读时长估算、文章卡片列表
- **Landing（落地页）** — Hero 区域、特性网格、用户评价、CTA 安装命令
- **Team（团队管理）** — 成员表格、角色徽章（所有者/管理员/成员/访客）、邀请功能
- **Inbox（收件箱）** — 邮件线程列表、预览面板、标星/归档/删除操作
- **Projects（项目管理）** — 卡片网格、进度条、状态徽章、团队头像
- **Orders（订单管理）** — 电商订单表格、KPI 统计卡片、状态过滤

### 改进

- **主题 CSS 导入** — 新增 `parseThemeCSS()` 支持从 shadcnthemer.com 导入主题
- **侧边栏无障碍** — 添加 `aria-label`、`<nav>` 元素、活跃项 `aria-current="page"`
- **全局 CSS** — 交互元素自动 `cursor: pointer`，支持 `prefers-reduced-motion`
- **包体积优化** — ESM 179KB（原 1,380KB），重依赖通过正则模式外置

### 测试

- 单元测试：49 个通过
- E2E 测试：16 个通过（Playwright）
- 所有 Story 均包含交互式 play 测试

---

## 0.1.0（2026-04-16）

### 新增特性

- 基于 shadcn/ui v3、Base UI 和 Tailwind CSS v4 提供 55+ 组件
- 新增 `ConfigProvider`，统一管理全局尺寸（`sm` / `md` / `lg`）、语言和类名前缀
- 内置国际化能力，支持英文、简体中文（`zh-CN`）和日文（`ja-JP`）
- 支持 `registerLocale()` 扩展自定义语言包
- 支持 `useTranslation()` 和 `formatMessage` 模板插值
- 自定义组件（DataTable、DatePicker、Combobox、Kanban 等）全部支持多语言
- 提供 `DataTable`，支持排序、过滤、分页、行选择
- 提供 `VirtualDataTable`，支持 100K+ 行虚拟滚动
- 提供 `EditableDataTable`，支持单元格点击后行内编辑
- 提供 `UrlDataTable`，支持过滤和分页与 URL 参数同步
- 提供 `KanbanBoard`，支持跨列拖拽
- 提供 `SortableList`，支持拖拽排序
- 提供 `DatePicker`、`Combobox`、`Form`、`Shortcuts`、`AnimatedCard`
- 支持 `ThemeProvider` 深色模式
- 提供 Storybook 10 文档和交互式 play 测试
- 增强无障碍能力，包括 aria-label、键盘导航和屏幕阅读器支持
- 提供尺寸感知组件，`Button`、`Input`、`Badge`、`Select`、`Textarea` 会响应 `ConfigProvider` 的尺寸配置

### 发布说明

- npm 公共包聚焦组件库能力，不包含页面模板类的公共导出面
- 页面级示例继续保留在 Storybook 中，用于展示组合方式和业务参考
- 后续版本会继续优化包体积与发布产物边界
