# @stcn52/next-ui

基于 **shadcn/ui v3**、**Tailwind CSS v4** 和 **React 19** 构建的现代 React 组件库。

[English README](./README.md) | [中文更新日志](./CHANGELOG.zh-CN.md)

## 特性

- 55+ 组件，覆盖按钮、表单、数据表格、看板、日期选择器等常见场景
- `ConfigProvider` 统一管理全局尺寸、语言和类名前缀
- 内置 i18n，支持英文、简体中文、日文，也支持自定义 locale
- 提供大数据量表格、虚拟滚动、行内编辑、URL 状态同步等高级数据能力
- 集成 dnd-kit，支持拖拽排序和看板交互
- 支持 `react-hook-form` + `zod` 表单校验
- 支持 schema 驱动的表单引擎，包含规则联动、派生值、可重复分组和自定义组件注册
- 支持深色模式、Storybook 文档和可访问性
- 提供对话场景组件：Bubble、BubbleList、ChatSender、ChatConversations、ThoughtChain
- Monaco 驱动的代码工作台：文件树、可拖拽编辑区和沙箱预览整合在一个紧凑容器中

## 安装

```bash
npm install @stcn52/next-ui
# 或
pnpm add @stcn52/next-ui
```

### Peer Dependencies

```bash
pnpm add react react-dom tailwindcss
```

## 快速开始

```tsx
import { Button, ConfigProvider } from "@stcn52/next-ui"
import "@stcn52/next-ui/styles.css"

function App() {
  return (
    <ConfigProvider locale="zh-CN" size="md">
      <Button>点击我</Button>
    </ConfigProvider>
  )
}
```

## 核心能力

### ConfigProvider

```tsx
import { ConfigProvider } from "@stcn52/next-ui"

<ConfigProvider size="lg" locale="zh-CN">
  {/* 所有组件都会继承大尺寸和中文语言 */}
</ConfigProvider>
```

### Schema 表单引擎

`form-engine` 可以根据 schema 渲染表单，并让业务项目注册自己的组件：

```tsx
import { SchemaForm, createFieldWidgetRegistry, defineFieldWidget } from "@stcn52/next-ui"
import { ColorPicker } from "./color-picker"

const colorPickerWidget = defineFieldWidget(({ fieldApi, fieldProps, disabled }) => (
  <ColorPicker
    fieldProps={fieldProps}
    value={fieldApi.state.value as string}
    disabled={disabled}
    onChange={(next) => fieldApi.handleChange(next)}
  />
))

const widgets = createFieldWidgetRegistry({
  "color-picker": colorPickerWidget,
})

<SchemaForm schema={schema} widgets={widgets} onSubmit={console.log} />
```

`fieldProps` 包含标签、错误和描述文案的无障碍绑定信息，业务组件应该把它透传给真正的输入控件。
`defineFieldWidget()` 不是必须的，但当 widget 会在多个表单里复用时会更清晰。

JSON schema 里也可以直接声明自定义组件：

```json
{
  "type": "input",
  "name": "brandColor",
  "label": "品牌色",
  "widget": "color-picker",
  "widgetProps": {
    "showPresets": true
  }
}
```

时间类组件也保持同样的可序列化约定，例如 `date-time-picker` 使用 ISO 字符串：

```json
{
  "type": "input",
  "name": "launchAt",
  "label": "发布窗口",
  "widget": "date-time-picker",
  "defaultValue": "2024-12-08T14:30:00",
  "widgetProps": {
    "hourCycle": 24,
    "placeholder": "选择发布时间"
  }
}
```

如果只需要时间，`time-picker` 则保持 `HH:mm` 字符串格式。

对于上传类组件，`widgetProps` 仍保持 JSON 可序列化；如果需要持久化表单值，建议保存附件元数据，而不是直接保存原始 `File` 对象。

### 自定义语言包

```tsx
import { registerLocale, ConfigProvider } from "@stcn52/next-ui"

registerLocale("ko-KR", {
  confirm: "확인",
  cancel: "취소",
  noResults: "결과가 없습니다.",
})

<ConfigProvider locale="ko-KR">...</ConfigProvider>
```

### useTranslation

```tsx
import { useTranslation } from "@stcn52/next-ui"

function MyComponent() {
  const t = useTranslation()
  return <p>{t("rowsSelected", { count: 3, total: 10 })}</p>
}
```

## 组件分类

| 分类 | 组件 |
| --- | --- |
| 布局 | Card、Separator、Resizable、AspectRatio、ScrollArea、Sidebar |
| 表单 | Input、Textarea、Select、Checkbox、RadioGroup、Switch、Slider、InputOTP、Form |
| 数据 | DataTable、VirtualDataTable、UrlDataTable、EditableDataTable |
| 反馈 | Alert、AlertDialog、Dialog、Drawer、Sheet、Sonner、Tooltip、Progress、Skeleton |
| 导航 | Breadcrumb、Tabs、NavigationMenu、Menubar、ContextMenu、DropdownMenu、Command |
| 展示 | Badge、Avatar、Carousel、HoverCard、Accordion、Collapsible、Toggle、ToggleGroup |
| 高级 | KanbanBoard、SortableList、DatePicker、Combobox、Shortcuts、AnimatedCard、CodeWorkspace |

## 页面模板说明

Storybook 中提供了一些组合式页面示例，用于演示真实业务场景下的组件编排方式。

这些页面模板仅用于演示和项目参考，不属于 npm 包的公共 API，也不建议业务方通过包入口直接依赖。

## 国际化

内置语言文件位于 `src/locales/`：

- `en.json`
- `zh-CN.json`
- `ja-JP.json`

```tsx
import { ConfigProvider, useTranslation } from "@stcn52/next-ui"
import zhCN from "@stcn52/next-ui/locales/zh-CN.json"

<ConfigProvider locale={zhCN}>
  <App />
</ConfigProvider>

const { t } = useTranslation()
t("kanban.addTask") // "添加任务"
```

## 开发

```bash
pnpm install
pnpm dev
pnpm storybook
pnpm build
pnpm build:lib
pnpm test
pnpm test:e2e
pnpm perf:chat
pnpm analyze
```

### 视觉快照基线

Playwright 的页面级视觉回归基线位于 `e2e/*.spec.ts-snapshots/`。
当前 FileManager 已覆盖默认态与暗色态，对应目录为 `e2e/data-grid-file-tree.spec.ts-snapshots/`。
团队流程和评审约定可参考 [docs/visual-regression.md](./docs/visual-regression.md)。

建议优先使用窄范围命令，只更新受影响的基线：

```bash
pnpm exec playwright test e2e/data-grid-file-tree.spec.ts --grep "FileManager"
pnpm exec playwright test e2e/data-grid-file-tree.spec.ts --grep "FileManager" --update-snapshots
pnpm exec playwright test e2e/data-grid-file-tree.spec.ts --grep "dark story" --update-snapshots
```

只有在视觉改动是预期行为且已经完成评审时才更新快照。
如果基线发生变化，请在 PR 中像审代码一样检查更新后的 `.png` 文件。
如果后续新增页面级视觉回归用例，优先使用来自 `iframe.html?id=...` 的稳定 Storybook story ID，保证 CI 中可复现。

性能基准命令支持参数：

```bash
RUNS=5 pnpm perf:chat
BASELINE_SEC=3.2 FAIL_ABOVE_PCT=15 pnpm perf:chat
```

- `BASELINE_SEC`：基线平均耗时（秒）
- `FAIL_ABOVE_PCT`：允许回归阈值百分比（默认 `20`）

## 发布检查

```bash
pnpm lint
pnpm test
pnpm test:e2e
pnpm publish:check
```

`publish:check` 会执行组件库构建和 npm 打包 dry-run 校验。

## 迁移指南（0.2.x）

- 样式请从 `@stcn52/next-ui/styles.css` 引入。
- Storybook 中的页面模板仅用于演示，不属于 npm 公共 API 导出。
- 对话场景建议优先使用 `ui` 下可复用组件：`Bubble`、`ChatSender`、`ChatConversations`。

## 常见问题（FAQ）

1. 为什么 `publish:check` 比普通构建慢？
因为会执行类型声明生成（`vite:dts`）和 npm dry-run 打包，这是预期行为。

2. 如何在 CI 中做聊天 E2E 性能回归告警？
可使用基线与阈值参数，例如：
`BASELINE_SEC=3.2 FAIL_ABOVE_PCT=15 pnpm perf:chat`。

## License

MIT
