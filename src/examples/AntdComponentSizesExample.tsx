import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/display/card';
import { Input } from '@/components/ui/inputs/input';
import { Badge } from '@/components/ui/display/badge';
import { Avatar, AvatarFallback } from '@/components/ui/display/avatar';

/**
 * Ant Design 组件尺寸系统示例
 * 展示所有组件的统一尺寸规范（small, middle, large）
 */
export default function AntdComponentSizesExample() {
  return (
    <div className="p-[var(--padding-xl)] space-y-8">
      {/* 标题区域 */}
      <div>
        <h1 className="text-3xl font-semibold mb-2" style={{ color: 'var(--color-text-heading)' }}>
          Ant Design 组件尺寸系统
        </h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          统一的组件尺寸规范：Small (24px) / Middle (32px) / Large (40px)
        </p>
      </div>

      {/* 按钮尺寸 */}
      <Card>
        <div className="p-[var(--padding-lg)]">
          <h2 className="text-xl font-medium mb-4" style={{ color: 'var(--color-text-heading)' }}>
            按钮尺寸 (Button)
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-24 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Small (24px)
              </div>
              <Button
                size="sm"
                style={{
                  height: 'var(--btn-height-sm)',
                  padding: '0 var(--btn-padding-horizontal-sm)',
                  fontSize: 'var(--btn-font-size-sm)',
                  borderRadius: 'var(--btn-border-radius-sm)',
                }}
              >
                小按钮
              </Button>
              <Button
                size="sm"
                variant="outline"
                style={{
                  height: 'var(--btn-height-sm)',
                  padding: '0 var(--btn-padding-horizontal-sm)',
                  fontSize: 'var(--btn-font-size-sm)',
                  borderRadius: 'var(--btn-border-radius-sm)',
                }}
              >
                次要按钮
              </Button>
              <Button
                size="sm"
                style={{
                  width: 'var(--btn-icon-only-width-sm)',
                  height: 'var(--btn-height-sm)',
                  padding: 0,
                  borderRadius: 'var(--btn-border-radius-sm)',
                }}
              >
                +
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-24 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Middle (32px)
              </div>
              <Button
                style={{
                  height: 'var(--btn-height)',
                  padding: '0 var(--btn-padding-horizontal)',
                  fontSize: 'var(--btn-font-size)',
                  borderRadius: 'var(--btn-border-radius)',
                }}
              >
                默认按钮
              </Button>
              <Button
                variant="outline"
                style={{
                  height: 'var(--btn-height)',
                  padding: '0 var(--btn-padding-horizontal)',
                  fontSize: 'var(--btn-font-size)',
                  borderRadius: 'var(--btn-border-radius)',
                }}
              >
                次要按钮
              </Button>
              <Button
                style={{
                  width: 'var(--btn-icon-only-width)',
                  height: 'var(--btn-height)',
                  padding: 0,
                  borderRadius: 'var(--btn-border-radius)',
                }}
              >
                +
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-24 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Large (40px)
              </div>
              <Button
                size="lg"
                style={{
                  height: 'var(--btn-height-lg)',
                  padding: '0 var(--btn-padding-horizontal-lg)',
                  fontSize: 'var(--btn-font-size-lg)',
                  borderRadius: 'var(--btn-border-radius-lg)',
                }}
              >
                大按钮
              </Button>
              <Button
                size="lg"
                variant="outline"
                style={{
                  height: 'var(--btn-height-lg)',
                  padding: '0 var(--btn-padding-horizontal-lg)',
                  fontSize: 'var(--btn-font-size-lg)',
                  borderRadius: 'var(--btn-border-radius-lg)',
                }}
              >
                次要按钮
              </Button>
              <Button
                size="lg"
                style={{
                  width: 'var(--btn-icon-only-width-lg)',
                  height: 'var(--btn-height-lg)',
                  padding: 0,
                  borderRadius: 'var(--btn-border-radius-lg)',
                }}
              >
                +
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* 输入框尺寸 */}
      <Card>
        <div className="p-[var(--padding-lg)]">
          <h2 className="text-xl font-medium mb-4" style={{ color: 'var(--color-text-heading)' }}>
            输入框尺寸 (Input)
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-24 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Small (24px)
              </div>
              <Input
                placeholder="小输入框"
                className="w-64"
                style={{
                  height: 'var(--input-height-sm)',
                  padding: 'var(--input-padding-vertical-sm) var(--input-padding-horizontal-sm)',
                  fontSize: 'var(--input-font-size-sm)',
                  borderRadius: 'var(--input-border-radius-sm)',
                }}
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="w-24 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Middle (32px)
              </div>
              <Input
                placeholder="默认输入框"
                className="w-64"
                style={{
                  height: 'var(--input-height)',
                  padding: 'var(--input-padding-vertical) var(--input-padding-horizontal)',
                  fontSize: 'var(--input-font-size)',
                  borderRadius: 'var(--input-border-radius)',
                }}
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="w-24 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Large (40px)
              </div>
              <Input
                placeholder="大输入框"
                className="w-64"
                style={{
                  height: 'var(--input-height-lg)',
                  padding: 'var(--input-padding-vertical-lg) var(--input-padding-horizontal-lg)',
                  fontSize: 'var(--input-font-size-lg)',
                  borderRadius: 'var(--input-border-radius-lg)',
                }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* 标签尺寸 */}
      <Card>
        <div className="p-[var(--padding-lg)]">
          <h2 className="text-xl font-medium mb-4" style={{ color: 'var(--color-text-heading)' }}>
            标签尺寸 (Tag)
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-24 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Small (18px)
              </div>
              <div
                className="inline-flex items-center rounded"
                style={{
                  height: 'var(--tag-height-sm)',
                  padding: '0 var(--tag-padding-horizontal-sm)',
                  fontSize: 'var(--tag-font-size-sm)',
                  backgroundColor: 'var(--color-primary-bg)',
                  color: 'var(--color-primary)',
                  border: '1px solid var(--color-primary-border)',
                }}
              >
                小标签
              </div>
              <div
                className="inline-flex items-center rounded"
                style={{
                  height: 'var(--tag-height-sm)',
                  padding: '0 var(--tag-padding-horizontal-sm)',
                  fontSize: 'var(--tag-font-size-sm)',
                  backgroundColor: 'var(--color-success-bg)',
                  color: 'var(--color-success)',
                  border: '1px solid var(--color-success-border)',
                }}
              >
                成功
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-24 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Middle (24px)
              </div>
              <div
                className="inline-flex items-center rounded"
                style={{
                  height: 'var(--tag-height)',
                  padding: '0 var(--tag-padding-horizontal)',
                  fontSize: 'var(--tag-font-size)',
                  backgroundColor: 'var(--color-primary-bg)',
                  color: 'var(--color-primary)',
                  border: '1px solid var(--color-primary-border)',
                }}
              >
                默认标签
              </div>
              <div
                className="inline-flex items-center rounded"
                style={{
                  height: 'var(--tag-height)',
                  padding: '0 var(--tag-padding-horizontal)',
                  fontSize: 'var(--tag-font-size)',
                  backgroundColor: 'var(--color-warning-bg)',
                  color: 'var(--color-warning)',
                  border: '1px solid var(--color-warning-border)',
                }}
              >
                警告
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-24 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Large (32px)
              </div>
              <div
                className="inline-flex items-center rounded"
                style={{
                  height: 'var(--tag-height-lg)',
                  padding: '0 var(--tag-padding-horizontal-lg)',
                  fontSize: 'var(--tag-font-size-lg)',
                  backgroundColor: 'var(--color-primary-bg)',
                  color: 'var(--color-primary)',
                  border: '1px solid var(--color-primary-border)',
                }}
              >
                大标签
              </div>
              <div
                className="inline-flex items-center rounded"
                style={{
                  height: 'var(--tag-height-lg)',
                  padding: '0 var(--tag-padding-horizontal-lg)',
                  fontSize: 'var(--tag-font-size-lg)',
                  backgroundColor: 'var(--color-error-bg)',
                  color: 'var(--color-error)',
                  border: '1px solid var(--color-error-border)',
                }}
              >
                错误
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 头像尺寸 */}
      <Card>
        <div className="p-[var(--padding-lg)]">
          <h2 className="text-xl font-medium mb-4" style={{ color: 'var(--color-text-heading)' }}>
            头像尺寸 (Avatar)
          </h2>
          <div className="flex items-end gap-6">
            <div className="text-center">
              <Avatar
                style={{
                  width: 'var(--avatar-size-xs)',
                  height: 'var(--avatar-size-xs)',
                  fontSize: 'var(--avatar-font-size-xs)',
                }}
              >
                <AvatarFallback>XS</AvatarFallback>
              </Avatar>
              <div className="text-xs mt-2" style={{ color: 'var(--color-text-secondary)' }}>
                XS (24px)
              </div>
            </div>

            <div className="text-center">
              <Avatar
                style={{
                  width: 'var(--avatar-size-sm)',
                  height: 'var(--avatar-size-sm)',
                  fontSize: 'var(--avatar-font-size-sm)',
                }}
              >
                <AvatarFallback>SM</AvatarFallback>
              </Avatar>
              <div className="text-xs mt-2" style={{ color: 'var(--color-text-secondary)' }}>
                SM (32px)
              </div>
            </div>

            <div className="text-center">
              <Avatar
                style={{
                  width: 'var(--avatar-size)',
                  height: 'var(--avatar-size)',
                  fontSize: 'var(--avatar-font-size)',
                }}
              >
                <AvatarFallback>MD</AvatarFallback>
              </Avatar>
              <div className="text-xs mt-2" style={{ color: 'var(--color-text-secondary)' }}>
                MD (40px)
              </div>
            </div>

            <div className="text-center">
              <Avatar
                style={{
                  width: 'var(--avatar-size-lg)',
                  height: 'var(--avatar-size-lg)',
                  fontSize: 'var(--avatar-font-size-lg)',
                }}
              >
                <AvatarFallback>LG</AvatarFallback>
              </Avatar>
              <div className="text-xs mt-2" style={{ color: 'var(--color-text-secondary)' }}>
                LG (60px)
              </div>
            </div>

            <div className="text-center">
              <Avatar
                style={{
                  width: 'var(--avatar-size-xl)',
                  height: 'var(--avatar-size-xl)',
                  fontSize: 'var(--avatar-font-size-xl)',
                }}
              >
                <AvatarFallback>XL</AvatarFallback>
              </Avatar>
              <div className="text-xs mt-2" style={{ color: 'var(--color-text-secondary)' }}>
                XL (80px)
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 徽章尺寸 */}
      <Card>
        <div className="p-[var(--padding-lg)]">
          <h2 className="text-xl font-medium mb-4" style={{ color: 'var(--color-text-heading)' }}>
            徽章尺寸 (Badge)
          </h2>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4">
              <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Small (14px)
              </div>
              <Badge
                style={{
                  height: 'var(--badge-height-sm)',
                  fontSize: 'var(--badge-font-size-sm)',
                  padding: '0 0.375rem',
                }}
              >
                5
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Default (20px)
              </div>
              <Badge
                style={{
                  height: 'var(--badge-height)',
                  fontSize: 'var(--badge-font-size)',
                  padding: '0 0.5rem',
                }}
              >
                99+
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Dot (6px)
              </div>
              <div
                className="rounded-full"
                style={{
                  width: 'var(--badge-dot-size)',
                  height: 'var(--badge-dot-size)',
                  backgroundColor: 'var(--color-error)',
                }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* 尺寸对照表 */}
      <Card>
        <div className="p-[var(--padding-lg)]">
          <h2 className="text-xl font-medium mb-4" style={{ color: 'var(--color-text-heading)' }}>
            组件尺寸对照表
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <th className="text-left py-3 px-4" style={{ color: 'var(--color-text-heading)' }}>组件</th>
                  <th className="text-left py-3 px-4" style={{ color: 'var(--color-text-heading)' }}>Small</th>
                  <th className="text-left py-3 px-4" style={{ color: 'var(--color-text-heading)' }}>Middle</th>
                  <th className="text-left py-3 px-4" style={{ color: 'var(--color-text-heading)' }}>Large</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--color-border-secondary)' }}>
                  <td className="py-3 px-4" style={{ color: 'var(--color-text)' }}>Button</td>
                  <td className="py-3 px-4" style={{ color: 'var(--color-text-secondary)' }}>24px</td>
                  <td className="py-3 px-4" style={{ color: 'var(--color-text-secondary)' }}>32px</td>
                  <td className="py-3 px-4" style={{ color: 'var(--color-text-secondary)' }}>40px</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--color-border-secondary)' }}>
                  <td className="py-3 px-4" style={{ color: 'var(--color-text)' }}>Input</td>
                  <td className="py-3 px-4" style={{ color: 'var(--color-text-secondary)' }}>24px</td>
                  <td className="py-3 px-4" style={{ color: 'var(--color-text-secondary)' }}>32px</td>
                  <td className="py-3 px-4" style={{ color: 'var(--color-text-secondary)' }}>40px</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--color-border-secondary)' }}>
                  <td className="py-3 px-4" style={{ color: 'var(--color-text)' }}>Select</td>
                  <td className="py-3 px-4" style={{ color: 'var(--color-text-secondary)' }}>24px</td>
                  <td className="py-3 px-4" style={{ color: 'var(--color-text-secondary)' }}>32px</td>
                  <td className="py-3 px-4" style={{ color: 'var(--color-text-secondary)' }}>40px</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--color-border-secondary)' }}>
                  <td className="py-3 px-4" style={{ color: 'var(--color-text)' }}>Tag</td>
                  <td className="py-3 px-4" style={{ color: 'var(--color-text-secondary)' }}>18px</td>
                  <td className="py-3 px-4" style={{ color: 'var(--color-text-secondary)' }}>24px</td>
                  <td className="py-3 px-4" style={{ color: 'var(--color-text-secondary)' }}>32px</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--color-border-secondary)' }}>
                  <td className="py-3 px-4" style={{ color: 'var(--color-text)' }}>Avatar</td>
                  <td className="py-3 px-4" style={{ color: 'var(--color-text-secondary)' }}>24px (XS) / 32px (SM)</td>
                  <td className="py-3 px-4" style={{ color: 'var(--color-text-secondary)' }}>40px</td>
                  <td className="py-3 px-4" style={{ color: 'var(--color-text-secondary)' }}>60px (LG) / 80px (XL)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4" style={{ color: 'var(--color-text)' }}>Pagination</td>
                  <td className="py-3 px-4" style={{ color: 'var(--color-text-secondary)' }}>24px</td>
                  <td className="py-3 px-4" style={{ color: 'var(--color-text-secondary)' }}>32px</td>
                  <td className="py-3 px-4" style={{ color: 'var(--color-text-secondary)' }}>40px</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
}
