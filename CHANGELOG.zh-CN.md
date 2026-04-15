# 更新日志

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
