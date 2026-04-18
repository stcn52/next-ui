# 📝 Ant Design 字体、图标、动效规范

## 🔤 字体规范

### 字体家族

Ant Design 采用**系统默认界面字体优先策略**，确保跨平台显示的易读性和可读性。

#### 字体栈

```css
/* 默认字体 */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
             'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 
             'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 
             'Noto Color Emoji';

/* 代码字体 */
font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, 
             Courier, monospace;
```

#### 中文字体

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
             'PingFang SC', 'Microsoft YaHei', '微软雅黑', 
             'Hiragino Sans GB', 'Heiti SC', sans-serif;
```

#### 数字字体

**推荐使用 `tabular-nums` 设置**，实现等宽展示，便于纵向对比：

```css
/* 等宽数字 */
font-variant-numeric: tabular-nums;
```

```tsx
// 示例：表格中的数字对齐
<td style={{ fontVariantNumeric: 'tabular-nums' }}>
  1,234.56
</td>
```

---

### 字体大小梯度

Ant Design 主字体从 12px 升级至 **14px**，基于 50cm 阅读距离和最佳阅读角度优化。

#### 字阶系统

系统定义了 **10 个不同尺寸的字体梯度**，受 5 音阶和自然律启发：

| 名称 | 字号 | 行高 | 用途 | CSS 变量 |
|------|------|------|------|----------|
| font-size-sm | 12px | 20px | 辅助文字、标签 | `--font-size-sm` |
| **font-size-base** | **14px** | **22px** | **正文（默认）** | `--font-size` |
| font-size-lg | 16px | 24px | 小标题、重要文本 | `--font-size-lg` |
| font-size-xl | 20px | 28px | 标题 | `--font-size-xl` |
| h5 | 14px | 22px | 五级标题 | - |
| h4 | 16px | 24px | 四级标题 | - |
| h3 | 20px | 28px | 三级标题 | - |
| h2 | 24px | 32px | 二级标题 | - |
| h1 | 38px | 46px | 一级标题 | - |
| display | 56px | 64px | 展示标题 | - |

#### 使用原则

**克制原则**：建议单个系统中控制在 **3-5 种字阶**。

```tsx
// ✅ 好：使用有限的字阶
<div>
  <h1 style={{ fontSize: '38px', lineHeight: '46px' }}>主标题</h1>
  <h2 style={{ fontSize: '24px', lineHeight: '32px' }}>副标题</h2>
  <p style={{ fontSize: '14px', lineHeight: '22px' }}>正文内容</p>
  <small style={{ fontSize: '12px', lineHeight: '20px' }}>辅助说明</small>
</div>

// ❌ 差：使用过多字阶
<div>
  <h1 style={{ fontSize: '56px' }}>...</h1>
  <h2 style={{ fontSize: '38px' }}>...</h2>
  <h3 style={{ fontSize: '24px' }}>...</h3>
  <h4 style={{ fontSize: '20px' }}>...</h4>
  <h5 style={{ fontSize: '16px' }}>...</h5>
  <p style={{ fontSize: '14px' }}>...</p>
  <small style={{ fontSize: '12px' }}>...</small>
</div>
```

**韵律原则**：在需要时跳跃选择字阶以产生韵律感。

```tsx
// 跳跃使用字阶，产生视觉韵律
<div>
  <h1 style={{ fontSize: '38px' }}>主标题</h1>  {/* 跳过 24px */}
  <p style={{ fontSize: '14px' }}>正文</p>
</div>
```

---

### 行高规范

**行高与字阶相对应**，作为包裹字体的无形盒子，与字阶共同决定视觉秩序。

#### 行高计算

```
行高 = 字号 + 8px（基础）
```

| 字号 | 行高 | 比例 |
|------|------|------|
| 12px | 20px | 1.67 |
| 14px | 22px | 1.57 |
| 16px | 24px | 1.5 |
| 20px | 28px | 1.4 |
| 24px | 32px | 1.33 |

#### 使用示例

```tsx
// 正文
<p style={{ 
  fontSize: '14px', 
  lineHeight: '22px' 
}}>
  正文内容，行高 22px 确保良好的可读性
</p>

// 标题
<h2 style={{ 
  fontSize: '24px', 
  lineHeight: '32px' 
}}>
  标题文本
</h2>

// 紧凑文本
<span style={{ 
  fontSize: '12px', 
  lineHeight: '20px' 
}}>
  辅助说明
</span>
```

---

### 字重使用

主要采用**两种字重**：regular (400) 和 medium (500)。

#### 字重规范

| 字重 | 数值 | 用途 | CSS 变量 |
|------|------|------|----------|
| Regular | 400 | 正文、描述 | `--font-weight` |
| Medium | 500 | 标题、强调 | `--font-weight-strong` |
| Semibold | 600 | 英文加粗 | - |

#### 使用原则

**秩序、稳定、克制**：避免过度使用字重变化。

```tsx
// ✅ 好：适度使用字重
<div>
  <h2 style={{ fontWeight: 500 }}>标题</h2>
  <p style={{ fontWeight: 400 }}>正文内容</p>
  <strong style={{ fontWeight: 500 }}>重要文本</strong>
</div>

// ❌ 差：过度使用字重
<div>
  <h2 style={{ fontWeight: 700 }}>标题</h2>
  <p style={{ fontWeight: 400 }}>正文</p>
  <strong style={{ fontWeight: 900 }}>重要</strong>
  <span style={{ fontWeight: 300 }}>次要</span>
</div>
```

---

### 无障碍设计

**字体颜色与背景保持 AAA 级对比度（7:1 以上）**，满足无障碍设计需求。

```tsx
// ✅ 好：高对比度
<div style={{ 
  backgroundColor: '#ffffff',
  color: 'rgba(0, 0, 0, 0.88)'  // 对比度 > 7:1
}}>
  文本内容
</div>

// ⚠️ 注意：低对比度
<div style={{ 
  backgroundColor: '#f0f0f0',
  color: 'rgba(0, 0, 0, 0.25)'  // 对比度 < 4.5:1
}}>
  占位符文本（仅用于非关键信息）
</div>
```

---

## 🎨 图标规范

### 图标设计原则

Ant Design 的图标设计遵循**四大原则**：

#### 1. 准确 (Accurate)
**造型准确、表意清晰，采用偶数原则避免小数点。**

- 图标应准确传达其功能
- 避免模糊或歧义的设计
- 使用偶数尺寸（16px、24px、32px）

#### 2. 简单 (Simple)
**在表意清楚的基础上保持图形简洁，"不做多余的修饰"。**

- 去除不必要的细节
- 保持视觉简洁
- 易于识别和记忆

#### 3. 节奏 (Rhythm)
**挖掘构图中的秩序之美。**

- 保持类似图标的构造一致性
- 理性考虑元素间的比例关系
- 通过微调线条粗细达到视觉平衡

#### 4. 愉悦 (Delightful)
**赋予适度的情感表达。**

- 在功能性基础上增加情感
- 避免过度装饰
- 保持专业和友好的平衡

---

### 图标尺寸规范

#### 基础规格

**设计规格**：
- 画板：1024 × 1024px
- 出血位：外围预留 64px

**元素尺寸标准**（遵循倍数原则）：
- 点：80、96、112、128px（16 倍数）
- 线条：56、64、72、80px（8 倍数）
- 圆角：8、16、32px（8 倍数）
- 三角角度：约 76 度

#### 使用尺寸

| 尺寸 | 用途 | CSS 类 |
|------|------|--------|
| 12px | 极小图标、内联图标 | `text-xs` |
| 14px | 小图标、按钮图标 | `text-sm` |
| 16px | 默认图标 | `text-base` |
| 20px | 中等图标 | `text-lg` |
| 24px | 大图标 | `text-xl` |
| 32px | 特大图标 | `text-2xl` |

#### 使用示例

```tsx
import { UserOutlined, SearchOutlined, SettingOutlined } from '@ant-design/icons';

// 默认尺寸（16px）
<UserOutlined />

// 自定义尺寸
<SearchOutlined style={{ fontSize: '20px' }} />

// 在按钮中使用
<Button icon={<SettingOutlined />}>
  设置
</Button>

// 不同尺寸对比
<div className="flex items-center gap-4">
  <UserOutlined style={{ fontSize: '12px' }} />
  <UserOutlined style={{ fontSize: '16px' }} />
  <UserOutlined style={{ fontSize: '20px' }} />
  <UserOutlined style={{ fontSize: '24px' }} />
</div>
```

---

### 图标使用规范

#### 设计要点

1. **保持一致性**
   - 同类图标使用相同的构造方式
   - 统一的线条粗细
   - 统一的圆角大小

2. **视觉平衡**
   - 通过微调达到视觉平衡
   - 考虑元素间的比例关系
   - 保持整体协调

3. **输出规范**
   - 删除多余节点保持整洁
   - 合并图形便于输出
   - 检查并修正小数点和奇数
   - 维持清晰的图层管理结构

#### 使用场景

```tsx
// 按钮图标
<Button icon={<PlusOutlined />}>新建</Button>

// 输入框图标
<Input prefix={<SearchOutlined />} placeholder="搜索" />

// 菜单图标
<Menu>
  <Menu.Item icon={<HomeOutlined />}>首页</Menu.Item>
  <Menu.Item icon={<UserOutlined />}>用户</Menu.Item>
</Menu>

// 状态图标
<div>
  <CheckCircleOutlined style={{ color: 'var(--color-success)' }} />
  <CloseCircleOutlined style={{ color: 'var(--color-error)' }} />
  <ExclamationCircleOutlined style={{ color: 'var(--color-warning)' }} />
</div>
```

---

## 🎬 动效规范

### 动效三大原则

#### 1. 自然 (Natural)
**遵循自然运动规律，保证视觉连贯性，让用户感知动作的合理性。**

例如：按钮动效设计模拟树叶在水面浮动的效果。

```tsx
// 自然的悬停效果
<Button style={{
  transition: 'all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)',
  transform: 'translateY(0)',
  ':hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  }
}}>
  悬停我
</Button>
```

#### 2. 高效 (Performant)
**在企业级应用中追求快速的过渡效果，节省过渡时间。**

出场动画采用更快速度，无需复杂的队列效果。

```tsx
// 快速的出场动画
<Modal
  style={{
    animation: 'fadeOut 0.2s ease-out',
  }}
>
  内容
</Modal>
```

#### 3. 克制 (Restrained)
**避免夸张修饰，只做有意义的动效。**

如菜单展开时，图标切换不是主要焦点，只需简洁指示变化即可。

```tsx
// 克制的图标旋转
<DownOutlined style={{
  transition: 'transform 0.2s',
  transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
}} />
```

---

### 动效价值

动效的四个核心价值：

1. **增加体验舒适度** - 平滑的过渡让操作更自然
2. **增加界面活力** - 适度的动画让界面更生动
3. **描述层级关系** - 通过动画展示元素的层级
4. **提供反馈和明确意向** - 让用户知道操作结果

---

### 动画时长

| 场景 | 时长 | 用途 | CSS 变量 |
|------|------|------|----------|
| 即时反馈 | 0.1s | 悬停、点击反馈 | `--motion-duration-fast` |
| 过渡动画 | 0.2s | 展开、收起 | `--motion-duration-mid` |
| 复杂动画 | 0.3s | 淡入、滑入 | `--motion-duration-slow` |

```tsx
// 不同时长的应用
<div>
  {/* 快速反馈 - 0.1s */}
  <Button style={{ transition: 'all 0.1s' }}>
    悬停反馈
  </Button>

  {/* 中等过渡 - 0.2s */}
  <Collapse style={{ transition: 'height 0.2s' }}>
    展开内容
  </Collapse>

  {/* 慢速动画 - 0.3s */}
  <Modal style={{ transition: 'opacity 0.3s' }}>
    淡入效果
  </Modal>
</div>
```

---

### 缓动曲线

Ant Design 使用多种缓动曲线来实现不同的动画效果：

| 名称 | 曲线 | 用途 | CSS 变量 |
|------|------|------|----------|
| 标准缓动 | cubic-bezier(0.645, 0.045, 0.355, 1) | 通用动画 | `--motion-ease-in-out` |
| 进入缓动 | cubic-bezier(0.55, 0.055, 0.675, 0.19) | 元素进入 | `--motion-ease-in` |
| 退出缓动 | cubic-bezier(0.215, 0.61, 0.355, 1) | 元素退出 | `--motion-ease-out` |
| 回弹效果 | cubic-bezier(0.12, 0.4, 0.29, 1.46) | 强调动画 | `--motion-ease-out-back` |

```tsx
// 使用不同的缓动曲线
<div>
  {/* 标准缓动 */}
  <div style={{ 
    transition: 'all 0.3s var(--motion-ease-in-out)' 
  }}>
    标准动画
  </div>

  {/* 进入缓动 */}
  <div style={{ 
    transition: 'transform 0.3s var(--motion-ease-in)' 
  }}>
    进入动画
  </div>

  {/* 退出缓动 */}
  <div style={{ 
    transition: 'opacity 0.2s var(--motion-ease-out)' 
  }}>
    退出动画
  </div>

  {/* 回弹效果 */}
  <div style={{ 
    transition: 'transform 0.3s var(--motion-ease-out-back)' 
  }}>
    回弹动画
  </div>
</div>
```

---

### 衡量标准

动效必须满足两个核心标准：

1. **目的性** - 动效需具有明确目的性，助力交互体验
2. **流畅性** - 必须保证流畅性，不能出现卡顿或掉帧

```tsx
// ✅ 好：有目的的动效
<Button style={{
  transition: 'all 0.3s',  // 提供视觉反馈
  ':hover': {
    transform: 'translateY(-2px)',  // 表示可点击
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',  // 增强层次
  }
}}>
  按钮
</Button>

// ❌ 差：无意义的动效
<div style={{
  animation: 'spin 2s infinite',  // 无目的的旋转
}}>
  普通文本
</div>
```

---

## 📚 实际应用示例

### 综合示例：卡片组件

```tsx
// 应用字体、图标、动效规范的完整示例
<Card
  style={{
    // 动效：自然、高效、克制
    transition: 'all 0.3s var(--motion-ease-in-out)',
    ':hover': {
      transform: 'translateY(-4px)',
      boxShadow: 'var(--box-shadow)',
    }
  }}
>
  {/* 标题：字号 16px，字重 500，行高 24px */}
  <h3 style={{
    fontSize: '16px',
    fontWeight: 500,
    lineHeight: '24px',
    marginBottom: '8px',
  }}>
    <UserOutlined style={{ marginRight: '8px', fontSize: '16px' }} />
    用户信息
  </h3>

  {/* 正文：字号 14px，字重 400，行高 22px */}
  <p style={{
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: '22px',
    color: 'var(--color-text)',
    marginBottom: '4px',
  }}>
    这是卡片的主要内容，使用 14px 字号确保良好的可读性。
  </p>

  {/* 辅助文本：字号 12px，行高 20px */}
  <small style={{
    fontSize: '12px',
    lineHeight: '20px',
    color: 'var(--color-text-secondary)',
  }}>
    最后更新：2024-04-18
  </small>
</Card>
```

---

## 🔗 相关资源

- [Ant Design 字体规范](https://ant.design/docs/spec/font-cn)
- [Ant Design 图标规范](https://ant.design/docs/spec/icon-cn)
- [Ant Design 动效规范](https://ant.design/docs/spec/motion-cn)
- [Ant Motion 动效库](https://motion.ant.design/)
- [Ant Design Icons](https://ant.design/components/icon-cn)

---

## 📝 相关文档

- 完整设计规范：`docs/ANTD_DESIGN_STANDARDS.md`
- 布局系统：`docs/ANTD_QUICK_REFERENCE.md`
- 组件尺寸：`docs/ANTD_COMPONENT_SIZES.md`
- 官方文档同步：`docs/OFFICIAL_DOCS_SYNC.md`
