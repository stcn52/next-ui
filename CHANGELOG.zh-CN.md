# 更新日志

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
