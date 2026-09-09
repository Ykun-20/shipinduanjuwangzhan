# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Selected visual direction

- The user selected Product Design ideation option 3 on 2026-08-21.
- Preserve the quiet black-box cinema/gallery direction: matte black surfaces, oversized Chinese typography, full-bleed cinematic imagery, near-invisible UI chrome, hairline dividers, and a single acid-lime playback accent.
- Keep the page image-led and restrained. Avoid template-like card grids, decorative gradients, glassmorphism, neon cyberpunk styling, and excessive rounded corners.
- The intended surface is desktop-first React + Vite with a maximum content width of 1700px.

- 图片分类与项目分类必须支持改名、添加、删除，并与前台及 COS 内容清单同步。删除分类需保留已有内容并迁移到用户选择的其他分类。图片资产缩略图必须无需点击即可显示。

- 用户确认精选项目草图：每个分类标题旁放“显示更多”，下方用真实作品封面单行横向展示，支持鼠标拖动、左右按钮及触屏滑动；显示更多查看当前分类全部作品，点击封面查看该作品。保留黑底电影画廊风格。

- 项目横向列表封面改为 9:16 竖屏卡片，图片使用 contain 完整显示，悬停不得放大裁切，继续保留单行滑动与显示更多。

- 项目封面悬停时静音循环播放视频，离开恢复封面；点击单个作品后弹窗直接播放视频，不显示重复封面；全部作品列表不同时自动播放。

- 图片资产区所有图片按原图比例完整显示，高度自适应，不使用按序号裁切的拼贴；文字置于图下，悬停不放大裁切。桌面双列，手机单列。

- 用户已确认上线版本：图片使用约 260px 宽、320px 高的完整缩略预览；全部作品为紧凑网格，单片独立居中播放器并支持返回列表。用户已在后续消息明确授权上线。

- 导航栏固定顶部，导航字约18px；顶部“联系我”弹出当前资料中的手机与邮箱；底部按钮继续弹出微信二维码。

- 关于我图片按原图比例、高度自动显示，不撑满裁切；区域最大宽度1700px，窄屏图片宽度上限600px。

- 首页与底部联系画面同样限制最大宽度1700px，不再使用视口高度无限撑满；媒体完整等比例显示，保留文字覆盖与响应式空间。

- 线上只提供作品展示，内容管理面板仅限本机开发版；播放器隐藏下载入口并禁用视频右键菜单。不得将前端限制描述为彻底防下载，原片私有需要独立预览资源及存储权限配置。

- 用户改选无云函数方案：线上恢复管理入口，使用独立密码前端解锁；实际写入仍依赖当前浏览器 COS 凭据及服务端权限。关闭管理或刷新后重新锁定，密码明文不得提交仓库。
