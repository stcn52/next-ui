import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/display/card';

/**
 * Ant Design 布局系统示例
 * 展示如何使用精细的间距和布局 token
 */
export default function AntdLayoutExample() {
  return (
    <div className="p-[var(--padding-xl)] space-y-8">
      {/* 标题区域 */}
      <div>
        <h1 className="text-3xl font-semibold mb-2" style={{ color: 'var(--color-text-heading)' }}>
          Ant Design 布局系统示例
        </h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          展示精细的间距控制和统一的设计 token
        </p>
      </div>

      {/* 间距梯度展示 */}
      <Card>
        <div className="p-[var(--padding-lg)]">
          <h2 className="text-xl font-medium mb-4" style={{ color: 'var(--color-text-heading)' }}>
            间距梯度 (Spacing Scale)
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-24 text-sm" style={{ color: 'var(--color-text-secondary)' }}>xxs (4px)</div>
              <div className="p-[var(--padding-xxs)] bg-[var(--color-primary-bg)] rounded">内容</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-24 text-sm" style={{ color: 'var(--color-text-secondary)' }}>xs (8px)</div>
              <div className="p-[var(--padding-xs)] bg-[var(--color-primary-bg)] rounded">内容</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-24 text-sm" style={{ color: 'var(--color-text-secondary)' }}>sm (12px)</div>
              <div className="p-[var(--padding-sm)] bg-[var(--color-primary-bg)] rounded">内容</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-24 text-sm" style={{ color: 'var(--color-text-secondary)' }}>default (16px)</div>
              <div className="p-[var(--padding)] bg-[var(--color-primary-bg)] rounded">内容</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-24 text-sm" style={{ color: 'var(--color-text-secondary)' }}>md (20px)</div>
              <div className="p-[var(--padding-md)] bg-[var(--color-primary-bg)] rounded">内容</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-24 text-sm" style={{ color: 'var(--color-text-secondary)' }}>lg (24px)</div>
              <div className="p-[var(--padding-lg)] bg-[var(--color-primary-bg)] rounded">内容</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-24 text-sm" style={{ color: 'var(--color-text-secondary)' }}>xl (32px)</div>
              <div className="p-[var(--padding-xl)] bg-[var(--color-primary-bg)] rounded">内容</div>
            </div>
          </div>
        </div>
      </Card>

      {/* 按钮尺寸展示 */}
      <Card>
        <div className="p-[var(--padding-lg)]">
          <h2 className="text-xl font-medium mb-4" style={{ color: 'var(--color-text-heading)' }}>
            控件高度 (Control Height)
          </h2>
          <div className="flex items-end gap-[var(--gap-md)]">
            <Button
              size="sm"
              style={{
                height: 'var(--control-height-sm)',
                padding: '0 var(--control-padding-horizontal-sm)',
                borderRadius: 'var(--radius)'
              }}
            >
              小按钮 (24px)
            </Button>
            <Button
              style={{
                height: 'var(--control-height)',
                padding: '0 var(--control-padding-horizontal)',
                borderRadius: 'var(--radius)'
              }}
            >
              默认按钮 (32px)
            </Button>
            <Button
              size="lg"
              style={{
                height: 'var(--control-height-lg)',
                padding: '0 var(--control-padding-horizontal)',
                borderRadius: 'var(--radius)'
              }}
            >
              大按钮 (40px)
            </Button>
          </div>
        </div>
      </Card>

      {/* 圆角展示 */}
      <Card>
        <div className="p-[var(--padding-lg)]">
          <h2 className="text-xl font-medium mb-4" style={{ color: 'var(--color-text-heading)' }}>
            圆角梯度 (Border Radius)
          </h2>
          <div className="flex gap-[var(--gap-lg)]">
            <div className="text-center">
              <div
                className="w-20 h-20 bg-[var(--color-primary)] mb-2"
                style={{ borderRadius: 'var(--radius-xs)' }}
              />
              <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>xs (2px)</div>
            </div>
            <div className="text-center">
              <div
                className="w-20 h-20 bg-[var(--color-primary)] mb-2"
                style={{ borderRadius: 'var(--radius-sm)' }}
              />
              <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>sm (4px)</div>
            </div>
            <div className="text-center">
              <div
                className="w-20 h-20 bg-[var(--color-primary)] mb-2"
                style={{ borderRadius: 'var(--radius)' }}
              />
              <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>default (6px)</div>
            </div>
            <div className="text-center">
              <div
                className="w-20 h-20 bg-[var(--color-primary)] mb-2"
                style={{ borderRadius: 'var(--radius-lg)' }}
              />
              <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>lg (8px)</div>
            </div>
          </div>
        </div>
      </Card>

      {/* 色彩系统展示 */}
      <Card>
        <div className="p-[var(--padding-lg)]">
          <h2 className="text-xl font-medium mb-4" style={{ color: 'var(--color-text-heading)' }}>
            色彩系统 (Color System)
          </h2>
          <div className="space-y-4">
            {/* 品牌色 */}
            <div>
              <div className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>品牌色 (Primary)</div>
              <div className="flex gap-2">
                <div className="w-16 h-16 rounded" style={{ backgroundColor: 'var(--color-primary-bg)' }} />
                <div className="w-16 h-16 rounded" style={{ backgroundColor: 'var(--color-primary-border)' }} />
                <div className="w-16 h-16 rounded" style={{ backgroundColor: 'var(--color-primary)' }} />
                <div className="w-16 h-16 rounded" style={{ backgroundColor: 'var(--color-primary-hover)' }} />
                <div className="w-16 h-16 rounded" style={{ backgroundColor: 'var(--color-primary-active)' }} />
              </div>
            </div>

            {/* 成功色 */}
            <div>
              <div className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>成功色 (Success)</div>
              <div className="flex gap-2">
                <div className="w-16 h-16 rounded" style={{ backgroundColor: 'var(--color-success-bg)' }} />
                <div className="w-16 h-16 rounded" style={{ backgroundColor: 'var(--color-success-border)' }} />
                <div className="w-16 h-16 rounded" style={{ backgroundColor: 'var(--color-success)' }} />
                <div className="w-16 h-16 rounded" style={{ backgroundColor: 'var(--color-success-hover)' }} />
                <div className="w-16 h-16 rounded" style={{ backgroundColor: 'var(--color-success-active)' }} />
              </div>
            </div>

            {/* 警告色 */}
            <div>
              <div className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>警告色 (Warning)</div>
              <div className="flex gap-2">
                <div className="w-16 h-16 rounded" style={{ backgroundColor: 'var(--color-warning-bg)' }} />
                <div className="w-16 h-16 rounded" style={{ backgroundColor: 'var(--color-warning-border)' }} />
                <div className="w-16 h-16 rounded" style={{ backgroundColor: 'var(--color-warning)' }} />
                <div className="w-16 h-16 rounded" style={{ backgroundColor: 'var(--color-warning-hover)' }} />
                <div className="w-16 h-16 rounded" style={{ backgroundColor: 'var(--color-warning-active)' }} />
              </div>
            </div>

            {/* 错误色 */}
            <div>
              <div className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>错误色 (Error)</div>
              <div className="flex gap-2">
                <div className="w-16 h-16 rounded" style={{ backgroundColor: 'var(--color-error-bg)' }} />
                <div className="w-16 h-16 rounded" style={{ backgroundColor: 'var(--color-error-border)' }} />
                <div className="w-16 h-16 rounded" style={{ backgroundColor: 'var(--color-error)' }} />
                <div className="w-16 h-16 rounded" style={{ backgroundColor: 'var(--color-error-hover)' }} />
                <div className="w-16 h-16 rounded" style={{ backgroundColor: 'var(--color-error-active)' }} />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 实际应用示例 */}
      <Card>
        <div className="p-[var(--padding-lg)]">
          <h2 className="text-xl font-medium mb-4" style={{ color: 'var(--color-text-heading)' }}>
            实际应用示例
          </h2>

          {/* 表单示例 */}
          <div
            className="p-[var(--padding-content-horizontal)] rounded-[var(--radius-lg)]"
            style={{
              backgroundColor: 'var(--color-fill-alter)',
              border: '1px solid var(--color-border)'
            }}
          >
            <div className="space-y-[var(--margin-md)]">
              <div>
                <label
                  className="block text-sm font-medium mb-[var(--margin-xs)]"
                  style={{ color: 'var(--color-text-label)' }}
                >
                  用户名
                </label>
                <input
                  type="text"
                  placeholder="请输入用户名"
                  className="w-full rounded-[var(--radius)]"
                  style={{
                    height: 'var(--control-height)',
                    padding: '0 var(--control-padding-horizontal)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-bg-container)',
                    color: 'var(--color-text)',
                  }}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-[var(--margin-xs)]"
                  style={{ color: 'var(--color-text-label)' }}
                >
                  密码
                </label>
                <input
                  type="password"
                  placeholder="请输入密码"
                  className="w-full rounded-[var(--radius)]"
                  style={{
                    height: 'var(--control-height)',
                    padding: '0 var(--control-padding-horizontal)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-bg-container)',
                    color: 'var(--color-text)',
                  }}
                />
              </div>

              <div className="flex gap-[var(--gap-sm)] pt-[var(--padding-xs)]">
                <Button
                  style={{
                    height: 'var(--control-height)',
                    padding: '0 var(--control-padding-horizontal)',
                    borderRadius: 'var(--radius)',
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--color-text-light-solid)',
                  }}
                >
                  登录
                </Button>
                <Button
                  variant="outline"
                  style={{
                    height: 'var(--control-height)',
                    padding: '0 var(--control-padding-horizontal)',
                    borderRadius: 'var(--radius)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                >
                  取消
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
